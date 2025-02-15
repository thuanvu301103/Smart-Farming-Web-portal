@echo off
setlocal enabledelayedexpansion

echo Select an option:
echo [1] Run both backend and frontend
echo [2] Run backend only
echo [3] Run frontend only
set /p choice=Enter your choice (1, 2, 3): 

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
) else (
    echo Invalid choice. Exiting.
)

pause
