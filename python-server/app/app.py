from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Form
from .minio_client import get_s3_client
from pydantic import BaseModel
import requests
import time
import json
import dill
import random
import io

app = FastAPI()

BUCKET_NAME = "models"
DOWNLOAD_DIR = "./downloaded_models"
BE_SERVER = "http://10.1.8.52:3002"

# Define Tags Model
class Tag(BaseModel):
    key: str
    value: str

class GenerateRequest(BaseModel):
    name: str
    version: str
    location: str
    temp: float
    humid: float
    rainfall: float

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
    bucket_names = [b['Name'] for b in s3.list_buckets().get('Buckets', [])]
    if BUCKET_NAME not in bucket_names:
        s3.create_bucket(Bucket=BUCKET_NAME)

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

def gen_script(file_like, location, temp, humid, rainfall):
    try:
        loaded_predict = dill.load(file_like)
        loaded_predict.__globals__['random'] = random
        loaded_predict.__globals__['json'] = json

    except Exception as e:
        raise RuntimeError(f"❌ Failed to load pickle object: {e}")

    try:
        result = loaded_predict(location, temp, humid, rainfall)
        return result
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        raise RuntimeError(f"❌ Error running loaded function: {e}\n📄 Traceback:\n{tb}")

@app.post("/model-versions/generate")
async def gen(request: GenerateRequest):
    # 🔄 Gọi backend để lấy thông tin model
    resp = requests.get(
        f"{BE_SERVER}/model-versions/get", 
        params={"name": request.name, "version": request.version}
    )
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail="❌ Model version not found.")

    model_info = resp.json()
    model_version = model_info.get("model_version")
    if not model_version:
        raise HTTPException(status_code=400, detail="❌ 'model_version' not found in response.")

    source = model_version.get("source")
    if not source:
        raise HTTPException(status_code=400, detail=f"❌ 'source' not found in model_version: {model_version}")

    file_key = source.split("/")[-1]

    # 📥 Tải file từ S3 vào bộ nhớ (RAM)
    s3 = get_s3_client()
    buffer = io.BytesIO()
    s3.download_fileobj(BUCKET_NAME, file_key, buffer)
    buffer.seek(0)  # Reset về đầu stream để đọc

    # 🧠 Gọi hàm từ buffer
    return gen_script(
        buffer,
        request.location,
        request.temp,
        request.humid,
        request.rainfall
    )
    
