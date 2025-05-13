import os
import json
import requests
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4

from .model_utils import train_and_save_model, predict_and_generate_json
from .minio_client import get_s3_client

app = FastAPI()

BUCKET_NAME = "models"
DOWNLOAD_DIR = "./downloaded_models"
BE_SERVER = "http://10.1.8.52:3002"

@app.post("/generate-model")
def generate_model():
    # 1. Train & save model
    file_name = f"model-{uuid4().hex}.pkl"
    file_path = f"/tmp/{file_name}"
    train_and_save_model(file_path)

    # 2. Upload to MinIO
    s3 = get_s3_client()
    try:
        s3.create_bucket(Bucket=BUCKET_NAME)
    except:
        pass  # Nếu bucket đã tồn tại

    s3.upload_file(file_path, BUCKET_NAME, file_name)
    os.remove(file_path)

    # 3. Trả link model trên MinIO
    uri = f"http://10.1.8.52:9000/{BUCKET_NAME}/{file_name}"
    return {"source": uri}

# Define the request schema
class GenerateScriptRequest(BaseModel):
    username: str
    password: str
    model_name: str


# Function to handle login and return access_token and user_id
def login_and_get_user_info(username: str, password: str):
    login_resp = requests.post(
        f"{BE_SERVER}/auth/login",
        json={"username": username, "password": password}
    )
    if login_resp.status_code != 201:
        raise HTTPException(status_code=401, detail="Login failed")

    login_data = login_resp.json()
    access_token = login_data.get("access_token")
    user_id = login_data.get("user_id")
    if not access_token or not user_id:
        raise HTTPException(status_code=500, detail="Invalid login response")

    return access_token, user_id


# Function to download the model from MinIO
def download_model_from_minio(source_url: str, model_filename: str):
    # 1. Parse the source_url to get the bucket and object name
    parsed_url = source_url.replace("http://", "").split("/", 1)
    if len(parsed_url) != 2:
        raise ValueError("Invalid source URL")
    
    bucket_name, object_name = parsed_url[1].split("/", 1)

    # 2. Create a directory to store the downloaded model
    os.makedirs(DOWNLOAD_DIR, exist_ok=True)
    local_file_path = os.path.join(DOWNLOAD_DIR, model_filename)

    # 3. Download the model using boto3 client
    s3 = get_s3_client()
    try:
        s3.download_file(bucket_name, object_name, local_file_path)
        print(f"Model downloaded successfully: {local_file_path}")
        return local_file_path
    except Exception as e:
        raise Exception(f"Failed to download model from MinIO: {str(e)}")


@app.post("/generate-script")
def generate_script(req: GenerateScriptRequest):
    try:
        access_token, user_id = login_and_get_user_info(req.username, req.password)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail="Login failed or token not obtained")

    # Bước 1: Lấy thông tin model version
    version_resp = requests.post(
        f"{BE_SERVER}/{user_id}/models/get-latest-version",
        headers=headers,
        json={"name": req.model_name}
    )
    if version_resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to get model version")

    version_data = version_resp.json()
    model_versions = version_data.get("model_versions", [])
    if not model_versions:
        raise HTTPException(status_code=404, detail="No model versions found")

    model_info = model_versions[0]
    source_url = model_info.get("source")
    full_model_name = model_info.get("name")
    model_version = model_info.get("version")

    if not source_url or not full_model_name or not model_version:
        raise HTTPException(status_code=500, detail="Incomplete model version data")

    # Bước 2: Extract tên model (sau dấu "/")
    try:
        model_name_for_get = full_model_name.split("/", 1)[1]
    except IndexError:
        raise HTTPException(status_code=500, detail="Invalid model name format")

    # Bước 3: Lấy model_id
    model_get_resp = requests.get(
        f"{BE_SERVER}/{user_id}/models/get",
        headers=headers,
        params={"name": model_name_for_get}
    )
    if model_get_resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to get model metadata")

    model_data = model_get_resp.json()
    model_id = model_data.get("registered_model", {}).get("_id")
    if not model_id:
        raise HTTPException(status_code=500, detail="model_id not found")

    # Bước 4: Download model
    model_filename = source_url.split("/")[-1]
    try:
        local_model_path = download_model_from_minio(source_url, model_filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error downloading model: {str(e)}")

    # Bước 5: Dự đoán và tạo file JSON
    try:
        input_data = np.array([[0.5, 0.3, 0.2]])
        predictions = predict_and_generate_json(input_data, local_model_path)

        json_filename = "predictions.json"
        with open(json_filename, "w") as f:
            json.dump(predictions, f, indent=4)

        print(f"Predictions saved to {json_filename}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating predictions: {str(e)}")

    # Bước 6: Upload file JSON
    try:
        with open(json_filename, "rb") as file:
            files = {
                "files": (json_filename, file, "application/json")
            }
            data = {
                "version": "0",
                "model_id": model_id,
                "model_version": model_version
            }

            upload_resp = requests.post(
                f"{BE_SERVER}/{user_id}/models/scripts/upload",
                headers={"Authorization": f"Bearer {access_token}"},
                files=files,
                data=data
            )

        if upload_resp.status_code != 200:
            raise HTTPException(status_code=upload_resp.status_code, detail="Failed to upload script")

        return {"message": "Script uploaded successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading script: {str(e)}")
