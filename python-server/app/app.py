from fastapi import FastAPI, File, UploadFile
from .minio_client import get_s3_client

app = FastAPI()

BUCKET_NAME = "models"
DOWNLOAD_DIR = "./downloaded_models"
BE_SERVER = "http://10.1.8.52:3002"

@app.get("/")
async def root():
    return {"message": "FastAPI server running on Docker - Port 7000"}

@app.post("/model-versions/create")
async def create_model_version(
    name, tags, description,
    file: UploadFile = File(...)
):
    file_name = f'predict-{int(time.time())}.pkl'
    source = f's3://minio/{BUCKET_NAME}/{file_name}'
    # Upload Model file to MonIO Server
    s3 = get_s3_client()
    try:
        s3.create_bucket(Bucket=BUCKET_NAME)
    except:
        pass  # bucket đã tồn tại
    s3.upload_fileobj(file.file, BUCKET_NAME, file_name)
    # Make post create Model Version call
    payload = {
        "name": name,
        "source": source,
        "tags": tags,
        "description": description
    } 
    resp = requests.post(
        f"{BE_SERVER}/model-versions/create",
        json=payload
    )
    if resp.status_code != 201:
        raise HTTPException(status_code=version_resp.status_code, detail="Failed to register model version")
    return {"message": "Create new Model Version successfully", "source": source}
    
    

