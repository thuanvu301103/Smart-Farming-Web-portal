from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.executors.pool import ThreadPoolExecutor
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Form
import pytz
from .minio_client import get_s3_client
from pydantic import BaseModel
import requests
import time
import json
import dill
import random
import io
import traceback
from typing import List, Optional, Tuple

app = FastAPI()

OPENWEATHER_API_KEY = "a9bd0f26a67655129698b3a1dc78e692"
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

# Hàm chuyển địa danh -> lat/lon
def get_lat_lon_from_location(location: str) -> Optional[Tuple[float, float]]:
    try:
        resp = requests.get(
            "http://api.openweathermap.org/geo/1.0/direct",
            params={"q": location, "limit": 1, "appid": OPENWEATHER_API_KEY},
            timeout=5
        )
        if resp.status_code == 401:
            print("❌ Invalid API key")
            return None
        resp.raise_for_status()

        data = resp.json()
        if not data:
            print(f"❌ Không tìm thấy dữ liệu địa lý cho '{location}'")
            return None

        return data[0]['lat'], data[0]['lon']
    except requests.exceptions.RequestException as e:
        print(f"❌ Exception in get_lat_lon_from_location: {e}")
        return None

# Hàm lấy thời tiết từ lat/lon
def get_weather_by_coordinates(lat: float, lon: float) -> Optional[dict]:
    try:
        url = "https://api.openweathermap.org/data/2.5/weather"
        params = {
            "lat": lat,
            "lon": lon,
            "appid": OPENWEATHER_API_KEY,
            "units": "metric"
        }
        resp = requests.get(url, params=params, timeout=5)

        if resp.status_code == 401:
            print("❌ Invalid API key khi lấy weather")
            return None
        resp.raise_for_status()

        data = resp.json()
        temperature = data["main"]["temp"]
        humidity = data["main"]["humidity"]
        rainfall = data.get("rain", {}).get("1h", 0)

        return {
            "temp": temperature,
            "humid": humidity,
            "rainfall": rainfall
        }
    except requests.exceptions.RequestException as e:
        print(f"❌ Exception in get_weather_by_coordinates: {e}")
        return None
    
@app.get("/")
async def root():
    return {"message": "FastAPI server running on Docker - Port 7000"}

@app.get("/weather")
async def get_weather_by_location(location: str):
    latlon = get_lat_lon_from_location(location)
    if not latlon:
        raise HTTPException(status_code=404, detail=f"Không tìm thấy vị trí '{location}'")

    lat, lon = latlon
    weather = get_weather_by_coordinates(lat, lon)
    if not weather:
        raise HTTPException(status_code=502, detail="Lỗi khi lấy dữ liệu thời tiết")

    # Trả về JSON đầy đủ thông tin
    return {
        "location": location,
        "lat": lat,
        "lon": lon,
        **weather
}

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

########### ==========Scheduler 
jobstores = {
    'default': SQLAlchemyJobStore(url='sqlite:///jobs.sqlite')
}

executors = {
    'default': ThreadPoolExecutor(20)
}

job_defaults = {
    'coalesce': False,
    'max_instances': 3
}

scheduler = BackgroundScheduler(
    jobstores=jobstores,
    executors=executors,
    job_defaults=job_defaults,
    timezone=pytz.timezone("Asia/Ho_Chi_Minh")
)

# Kiểm soát việc start/shutdown trong lifecycle của ứng dụng
@app.on_event("startup")
async def startup_event():
    if not scheduler.running:
        scheduler.start()
        print(f"✅ Scheduler started at {datetime.now()} with timezone {scheduler.timezone}")

@app.on_event("shutdown")
async def shutdown_event():
    if scheduler.running:
        scheduler.shutdown()
        print("❌ Scheduler shutdown!")
# Define a sample job functiondef sample_job(model_name: str):
def sample_job(model_name: str):
    try:
        print("🔐 Bắt đầu đăng nhập...")

        login_resp = requests.post(f"{BE_SERVER}/auth/login", json={
            "username": "KatBOT",
            "password": "1234"
        })
        print(f"🔐 Login status: {login_resp.status_code}")
        if login_resp.status_code != 201:
            print(f"❌ Login failed: {login_resp.text}")
            return

        login_data = login_resp.json()
        token = login_data.get("access_token")
        user_id = login_data.get("user_id")

        if not token or not user_id:
            print("❌ Token hoặc user_id không tồn tại.")
            return

        # 🔍 Gọi get-all-subscribed
        print(f"🌐 Đang lấy danh sách model đã đăng ký của user_id={user_id}...")
        subscribed_resp = requests.get(
            f"{BE_SERVER}/models/get-all-subscribed",
            params={"user_id": user_id},
            headers={"Authorization": f"Bearer {token}"}
        )
        if subscribed_resp.status_code != 200:
            print(f"❌ Không thể lấy danh sách model đã đăng ký: {subscribed_resp.text}")
            return

        subscribed_models = subscribed_resp.json()
        location = None

        for model in subscribed_models:
            if model.get("model_name") == model_name:
                location = model.get("location")
                break

        if not location:
            print(f"❌ Không tìm thấy location cho model '{model_name}' trong danh sách đã đăng ký.")
            return

        print(f"📍 Tìm thấy location: {location} cho model: {model_name}")

        # 🔍 Lấy version mới nhất
        print(f"🔍 Đang lấy version mới nhất cho model '{model_name}'...")
        latest_version_resp = requests.post(
            f"{BE_SERVER}/model-versions/get-latest-versions",
            json={"name": model_name, "stages": ["None"]},
        )
        print(f"📦 Get-latest-version status: {latest_version_resp.status_code}")
        if latest_version_resp.status_code != 201:
            print(f"❌ Không lấy được version: {latest_version_resp.text}")
            return

        model_info = latest_version_resp.json()
        latest_versions = model_info.get("model_versions", [])
        if not latest_versions:
            print(f"❌ Không có phiên bản nào cho model '{model_name}'")
            return

        model_version = latest_versions[0]["version"]
        print(f"📌 Dùng version: {model_version}")

        # 📤 Gọi API generate script
        print(f"📤 Gọi API generate script cho model '{model_name}'...")

        generate_resp = requests.post(
            f"{BE_SERVER}/{user_id}/models/scripts/generate",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "model_name": model_name,
                "model_version": model_version,
                "location": location,
            }
        )

        print(f"📨 Generate status: {generate_resp.status_code}")
        if generate_resp.status_code != 201:
            print(f"❌ Generate script thất bại: {generate_resp.text}")
        else:
            print(f"✅ Đã tạo và upload script cho model '{model_name}' version '{model_version}'.")

    except Exception as e:
        print(f"❌ Lỗi trong job cho model '{model_name}': {e}")
        print(traceback.format_exc())

class JobResponse(BaseModel):
    job_id: str
    cron_expression: str
    
# Add a job to the scheduler
@app.post("/models/add-job")
async def add_job(model_name: str):
    try:
        resp = requests.get(
            f"{BE_SERVER}/models/get", 
            params={"name": model_name}
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail="❌ Model not found.")

        model_info = resp.json()
        tags = model_info["registered_model"]["tags"]
        cron_expression = next((tag["value"] for tag in tags if tag["key"] == "schedule"), None)

        if not cron_expression:
            raise HTTPException(status_code=400, detail="❌ No schedule tag found.")

        job_id = model_name
        print(f"📆 Đăng ký job '{job_id}' với cron '{cron_expression}'")

        # Tạo trigger có kiểm tra lỗi
        try:
            trigger = CronTrigger.from_crontab(cron_expression, timezone=pytz.timezone("Asia/Ho_Chi_Minh"))
        except ValueError as e:
            raise HTTPException(status_code=400, detail=f"❌ Cron expression lỗi: {e}")

        job = scheduler.add_job(
            sample_job,
            trigger,
            id=job_id,
            args=[job_id],
            replace_existing=True
        )
        
        print(f"🧩 Current jobs: {[job.id for job in scheduler.get_jobs()]}")
        print(f"⏰ Job {job_id} will run next at: {job.next_run_time}")
        return JobResponse(job_id=job_id, cron_expression=cron_expression)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ Failed to add job: {e}")


# Remove a job from the scheduler
@app.delete("/remove-job/{job_id}")
async def remove_job(job_id: str):
    try:
        scheduler.remove_job(job_id)
        return {"msg": f"✅ Job {job_id} removed successfully"}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"❌ Job {job_id} not found: {e}")
