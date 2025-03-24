import mlflow

mlflow.set_tracking_uri("http://127.0.0.1:5000")  # Đổi nếu cần
client = mlflow.MlflowClient()
model_name = "New Registered Model"

# Lấy model mới nhất
latest_versions = client.get_latest_versions(model_name)

for v in latest_versions:
    print(f"Version: {v.version}, Stage: {v.current_stage}, Source: {v.source}")
