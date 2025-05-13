from fastapi import FastAPI
from uuid import uuid4
import os

from .model_utils import train_and_save_model
from .minio_client import get_s3_client

app = FastAPI()
BUCKET_NAME = "models"

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
