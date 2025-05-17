from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from .minio_client import get_s3_client
from pydantic import BaseModel
import requests
import time

app = FastAPI()

BUCKET_NAME = "models"
DOWNLOAD_DIR = "./downloaded_models"
BE_SERVER = "http://10.1.8.52:3002"

# Define Tags Model
class Tag(BaseModel):
    key: str
    value: str

# Define Request Model
class ModelVersionRequest(BaseModel):
    name: str
    tags: list[Tag]  # ✅ Structured tags data
    description: str

@app.get("/")
async def root():
    return {"message": "FastAPI server running on Docker - Port 7000"}

@app.post("/model-versions/create")
async def create_model_version(
    request_data: ModelVersionRequest,  # ✅ Parses JSON body correctly
    file: UploadFile = File(...)
):
    file_name = f'predict-{int(time.time())}.pkl'
    source = f's3://minio/{BUCKET_NAME}/{file_name}'

    # ✅ Upload model file to MinIO Server
    s3 = get_s3_client()
    try:
        s3.create_bucket(Bucket=BUCKET_NAME)
    except s3.exceptions.BucketAlreadyExists:
        pass  # Bucket already exists

    s3.upload_fileobj(file.file, BUCKET_NAME, file_name)

    # ✅ Convert request data to JSON payload
    payload = {
        "name": request_data.name,
        "source": source,
        "tags": [tag.dict() for tag in request_data.tags],  # Convert Pydantic model to dict
        "description": request_data.description
    }

    # ✅ Make POST request to register Model Version
    resp = requests.post(
        f"{BE_SERVER}/model-versions/create",
        json=payload
    )

    if resp.status_code != 201:
        raise HTTPException(status_code=resp.status_code, detail="Failed to register model version")

    return {"message": "Create new Model Version successfully", "source": source}

    
    

