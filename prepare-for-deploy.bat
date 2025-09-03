@echo off
echo.
echo ===================================================
echo    University Course Management System Deployer
echo ===================================================
echo.
echo This script will help prepare your project for deployment to:
echo  1) Netlify (Frontend)
echo  2) Railway (Backend and Database)
echo.

rem Ensure all dependencies are installed
echo Step 1: Ensuring all dependencies are installed...
echo.
cd frontend\course-management-ui
call npm ci --legacy-peer-deps
if %ERRORLEVEL% neq 0 (
    echo Error installing frontend dependencies.
    exit /b %ERRORLEVEL%
)
echo Frontend dependencies installed successfully.
echo.

rem Build the frontend
echo Step 2: Building the frontend...
echo.
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Error building frontend.
    exit /b %ERRORLEVEL%
)
echo Frontend built successfully.
echo.

rem Build the backend
echo Step 3: Building the backend...
echo.
cd ..\..\backend
call .\mvnw.cmd clean package -DskipTests
if %ERRORLEVEL% neq 0 (
    echo Error building backend.
    exit /b %ERRORLEVEL%
)
echo Backend built successfully.
echo.

echo ===================================================
echo            Preparation Complete!
echo ===================================================
echo.
echo Your project is now ready for deployment.
echo.
echo Next steps:
echo  1. Commit and push your changes to GitHub:
echo     git add .
echo     git commit -m "Prepare for deployment"
echo     git push
echo.
echo  2. Follow the instructions in DEPLOYMENT.md to deploy to Netlify and Railway.
echo.
echo Press any key to exit...
pause > nul
