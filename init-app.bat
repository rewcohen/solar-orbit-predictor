@echo off

REM Set window title immediately
title Solar Orbit Predictor Server

REM Check if this script was called with a parameter
if "%~1"=="stop" goto :stop_server
if "%~1"=="restart" goto :restart_server
if "%~1"=="status" goto :server_status

echo ===================================
echo    🌌 Solar Orbit Predictor 🌌
echo ===================================
echo.
echo 🚀 Starting Solar Orbit Predictor...
echo 👍 Keep this window open to keep the server running
echo 🛑 Close this window or press Ctrl+C to stop the server
echo.
echo 🌐 App will be available at: http://localhost:3000
echo.
echo 📝 Debug logging is enabled - check browser console for details
echo.

REM Log startup information
echo [%DATE% %TIME%] Starting Solar Orbit Predictor Server >> server.log
echo Server startup initiated >> server.log

REM Start the server with error capture
echo Starting npm development server...
echo.

npm start 2>> server_error.log

REM Log when server stops
echo [%DATE% %TIME%] Server stopped >> server.log
echo Server process exited >> server.log

REM This will only execute if the server is stopped
echo.
echo Server stopped.

:stop_server
echo ===================================
echo    🌌 Stop Solar Orbit Predictor Server 🌌
echo ===================================
echo.

REM Find and kill the Node.js process running on port 3000
echo Checking for running server on port 3000...
set "SERVER_FOUND=0"

REM Get the PID of the process listening on port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    if not "%%a"=="" if not "%%a"=="0" (
        echo Found server process with PID: %%a
        echo Stopping server process...
        taskkill /PID %%a /F >nul 2>&1
        if !errorlevel! == 0 (
            echo ✅ Server stopped successfully
            set "SERVER_FOUND=1"
        ) else (
            echo ❌ Failed to stop server process
        )
    )
)

if "%SERVER_FOUND%"=="0" (
    echo ℹ️  No active server found on port 3000
    REM Also try to kill any remaining node processes
    echo 🔄 Attempting to clean up any remaining Node.js processes...
    taskkill /FI "IMAGENAME eq node.exe" /F >nul 2>&1
    taskkill /FI "WINDOWTITLE eq React Dev Server*" /F >nul 2>&1
    echo ✅ Cleanup attempt complete
)
echo.
goto :eof

:restart_server
echo ===================================
echo    🌌 Restart Solar Orbit Predictor Server 🌌
echo ===================================
echo.

echo Stopping any existing server...
call :stop_server
timeout /t 2 >nul
echo Starting new server instance...
call "%~f0"
goto :eof

:server_status
echo ===================================
echo    🌌 Solar Orbit Predictor Status 🌌
echo ===================================
echo.

REM Check if server is running
netstat -ano | findstr :3000 >nul 2>&1
if not errorlevel 1 (
    echo ✅ Status: RUNNING
    echo 🌐 Server is accessible at: http://localhost:3000
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        echo 🔢 Process ID: %%a
    )
) else (
    echo 🔴 Status: NOT RUNNING
    echo ℹ️  Server is not currently running on port 3000
    echo 📝 Use 'init-app.bat' to start the server
)
echo.
goto :eof
