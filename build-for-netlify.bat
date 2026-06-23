@echo off
REM ============================================================================
REM Build Script for Netlify Deployment (Windows)
REM This script builds your frontend and prepares it for Netlify
REM ============================================================================

echo.
echo ========================================
echo Building Data Migration Tool for Netlify
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "frontend" (
    echo [ERROR] frontend directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Navigate to frontend directory
cd frontend

echo [Step 1] Installing dependencies...
echo.
call npm install

if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed!
    pause
    exit /b 1
)

echo.
echo [Step 2] Building the application...
echo.
call npm run build

if errorlevel 1 (
    echo.
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Your app is ready for Netlify!
echo ========================================
echo.
echo The build folder is located at:
echo %CD%\build
echo.
echo Next steps:
echo 1. Open File Explorer and navigate to: %CD%\build
echo 2. Go to https://app.netlify.com
echo 3. Drag the 'build' folder to Netlify
echo 4. Your demo will be live in 30 seconds!
echo.
echo ========================================

REM Open the build folder in File Explorer (Windows)
echo.
echo Opening build folder in File Explorer...
start "" "%CD%\build"

echo.
pause

@REM Made with Bob
