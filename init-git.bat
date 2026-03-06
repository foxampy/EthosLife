@echo off
chcp 65001 >nul
echo ==========================================
echo EthosLife SAFT Platform - Git Init Script
echo ==========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not installed!
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

REM Initialize git repo
echo [1/5] Initializing Git repository...
git init
if errorlevel 1 (
    echo [ERROR] Failed to initialize git repo
    pause
    exit /b 1
)

echo.
echo [2/5] Adding files to Git...
git add .
if errorlevel 1 (
    echo [ERROR] Failed to add files
    pause
    exit /b 1
)

echo.
echo [3/5] Creating initial commit...
git commit -m "Initial commit: SAFT Platform with dynamic pricing and Telegram bot"
if errorlevel 1 (
    echo [ERROR] Failed to create commit
    pause
    exit /b 1
)

echo.
echo ==========================================
echo Repository initialized successfully!
echo ==========================================
echo.
echo Next steps:
echo 1. Create a repository on GitHub:
echo    https://github.com/new
echo.
echo 2. Run these commands:
echo    git remote add origin https://github.com/YOUR_USERNAME/ethoslife-saft.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Deploy to Render:
echo    https://render.com
echo.
pause
