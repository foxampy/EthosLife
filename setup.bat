@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo ==========================================
echo EthosLife SAFT Platform Setup
echo ==========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=1" %%a in ('node -v') do set NODE_VERSION=%%a
echo [OK] Node.js %NODE_VERSION% detected

echo.
echo Installing dependencies...
npm install

if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [OK] Dependencies installed

REM Check if .env exists
if not exist .env (
    echo.
    echo Creating .env file from template...
    copy .env.example .env
    echo [OK] .env file created
    echo.
    echo IMPORTANT: Edit .env file with your Telegram bot token and chat ID!
) else (
    echo [OK] .env file already exists
)

REM Create data directory
if not exist data mkdir data

echo.
echo ==========================================
echo Setup complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Edit .env file with your credentials
echo 2. Run: npm start
echo 3. Open http://localhost:3000
echo.
echo For Telegram bot setup:
echo   1. Message @BotFather to create bot
echo   2. Message @userinfobot to get your chat ID
echo.
pause
