@echo off
setlocal enabledelayedexpansion

echo Select an option:
echo [1] Run NestJS backend
echo [2] Run MLflow Tracking Server
set /p choice=Enter your choice (1, 2): 

if "!choice!"=="1" (
    echo Starting backend...
    start cmd /k "cd be-server && npm run start"
) else if "!choice!"=="2" (
    echo Starting MLflow Tracking Server...
    start cmd /k "mlflow server --backend-store-uri sqlite:///mlflow-server/mlflow.db --default-artifact-root ./mlflow-server/mlruns --host 0.0.0.0 --port 5000"  
) else (
    echo Invalid choice. Exiting.
)

pause
