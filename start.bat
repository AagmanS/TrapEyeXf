@echo off
echo.
echo  ████████╗██████╗  █████╗ ██████╗ ███████╗██╗   ██╗███████╗
echo  ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔════╝╚██╗ ██╔╝██╔════╝
echo     ██║   ██████╔╝███████║██████╔╝█████╗   ╚████╔╝ █████╗
echo     ██║   ██╔══██╗██╔══██║██╔═══╝ ██╔══╝    ╚██╔╝  ██╔══╝
echo     ██║   ██║  ██║██║  ██║██║     ███████╗   ██║   ███████╗
echo     ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚══════╝   ╚═╝   ╚══════╝
echo.
echo  [AI Cybersecurity Platform] Starting services...
echo  ================================================
echo.

:: Set working directory to script location
cd /d "%~dp0"

:: Check Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo  [ERROR] Python not found. Please install Python 3.9+
    pause
    exit /b 1
)

:: Check Node
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo  [ERROR] Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

echo  [1/4] Installing Python dependencies...
cd backend
pip install -r requirements.txt -q
if %ERRORLEVEL% NEQ 0 (
    echo  [WARNING] Some Python packages may have failed to install
)
cd ..

echo.
echo  [2/4] Training ML models...
cd ml_models
python generate_models.py
if %ERRORLEVEL% NEQ 0 (
    echo  [WARNING] ML model training had warnings - using heuristic fallbacks
)
cd ..

echo.
echo  [3/4] Starting FastAPI backend (port 8000)...
start "TrapEye Backend" cmd /k "cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo  [4/4] Starting Next.js frontend (port 3000)...
start "TrapEye Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo  ================================================
echo  • Frontend:  http://localhost:3000
echo  • Backend:   http://localhost:8000
echo  • API Docs:  http://localhost:8000/api/docs
echo  ================================================
echo.
echo  Press any key to open the browser...
pause >nul
start http://localhost:3000
