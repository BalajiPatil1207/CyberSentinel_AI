@echo off
echo ========================================================
echo  CyberSentinel AI - Starting Python Security Engine
echo ========================================================
echo.
cd /d "%~dp0"
echo [1/2] Checking and installing dependencies...
pip install -r requirements.txt
echo.
echo [2/2] Launching FastAPI microservice on http://127.0.0.1:8000 ...
python api.py
pause
