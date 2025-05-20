# Sử dụng Python 3.13
FROM python:3.13

WORKDIR /app
COPY . /app

# Cài đặt thư viện
RUN pip install fastapi uvicorn boto3 python-multipart pydantic requests dill apscheduler SQLAlchemy pytz

# Mở cổng 7000
EXPOSE 7000

# Chạy FastAPI server trên cổng 7000 từ thư mục gốc
CMD ["uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "7000"]
