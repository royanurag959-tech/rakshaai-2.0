@echo off
title RakshaAI 2.0 Launcher
echo ===================================================
echo           Starting RakshaAI 2.0 Platform
echo ===================================================
echo.
echo Starting Backend (FastAPI on http://127.0.0.1:8000)...
start "RakshaAI Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo Starting Frontend (React on http://localhost:5173)...
start "RakshaAI Frontend" cmd /k "cd /d %~dp0frontend && npm.cmd run dev"

timeout /t 3 /nobreak >nul

echo Opening browser...
start http://localhost:5173

echo.
echo ===================================================
echo   RakshaAI 2.0 is running!
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://127.0.0.1:8000/docs
echo ===================================================
pause
