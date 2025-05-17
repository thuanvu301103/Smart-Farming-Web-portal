from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Form
from .minio_client import get_s3_client
from pydantic import BaseModel
import requests
import time
import json

app = FastAPI()

BUCKET_NAME = "models"
DOWNLOAD_DIR = "./downloaded_models"
BE_SERVER = "http://10.1.8.52:3002"

# Define Tags Model
class Tag(BaseModel):
    key: str
    value: str

@app.get("/")
async def root():
    return {"message": "FastAPI server running on Docker - Port 7000"}

@app.post("/model-versions/create")
async def create_model_version(
    name: str = Form(...),
    description: str = Form(...),
    tags: str = Form(...),  # Send as JSON string, then parse
    file: UploadFile = File(...)
):
    try:
        tag_objs: List[Tag] = [Tag(**t) for t in json.loads(tags)]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid tags format: {e}")

    file_name = f'predict-{int(time.time())}.pkl'
    source = f's3://minio/{BUCKET_NAME}/{file_name}'

    # ✅ Upload to MinIO
    s3 = get_s3_client()
    try:
        s3.create_bucket(Bucket=BUCKET_NAME)
    except s3.exceptions.BucketAlreadyExists:
        pass

    s3.upload_fileobj(file.file, BUCKET_NAME, file_name)

    # ✅ Prepare JSON payload for backend
    payload = {
        "name": name,
        "source": source,
        "tags": [tag.dict() for tag in tag_objs],
        "description": description
    }

    resp = requests.post(f"{BE_SERVER}/model-versions/create", json=payload)

    if resp.status_code != 201:
        raise HTTPException(status_code=resp.status_code, detail="Failed to register model version")

    return {"message": "Create new Model Version successfully", "source": source}
