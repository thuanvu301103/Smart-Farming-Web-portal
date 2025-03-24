import mlflow

# Config MLflow Tracking Server
mlflow.set_tracking_uri("http://localhost:5000")

# Input Run ID & Model Name
run_id = "28149c4a2de143a88760c92b2929fdfd" # Replace with your runId
artifact_path = "random_forest_model"  # Name of model in Artifact
model_name = "New Registered Model"  # Name of model trong Model Registry

# Register model into MLflow Model Registry
model_uri = f"runs:/{run_id}/{artifact_path}"
registered_model = mlflow.register_model(model_uri, model_name)

# 📌 In thông tin Model Version mới đăng ký
print(f"✅ Model '{model_name}' registered!")
print(f"📌 Model URI: {registered_model.source}")
print(f"🔢 Model Version: {registered_model.version}")

# Check
print("\n🔍 To check, open MLflow UI: http://localhost:5000/#/models")
