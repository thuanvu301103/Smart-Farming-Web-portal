# Sử dụng Python 3.9
FROM python:3.9

WORKDIR /app
COPY . /app

# Cài đặt thư viện
RUN pip install fastapi uvicorn

# Mở cổng 7000
EXPOSE 7000

# Chạy FastAPI server trên cổng 7000 từ thư mục gốc
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7000"]
