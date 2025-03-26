@echo off
setlocal enabledelayedexpansion

echo Select an option:
echo [1] Run both backend and frontend
echo [2] Run backend only
echo [3] Run frontend only
echo [4] Run MLflow Tracking Server
set /p choice=Enter your choice (1, 2, 3, 4): 

if "!choice!"=="1" (
    echo Starting backend and frontend...
    start cmd /k "cd be-server && npm run start"
    start cmd /k "cd fe-server && npm start"
) else if "!choice!"=="2" (
    echo Starting backend...
    start cmd /k "cd be-server && npm run start"
) else if "!choice!"=="3" (
    echo Starting frontend...
    start cmd /k "cd fe-server && npm start"
) else if "!choice!"=="4" (
    echo Starting MLflow Tracking Server...
    start cmd /k "mlflow server --backend-store-uri sqlite:///mlflow-server/mlflow.db --default-artifact-root ./mlflow-server/mlruns --host 0.0.0.0 --port 5000"
) else (
    echo Invalid choice. Exiting.
)

pause
