@echo off
echo University Course Management System - Local Testing
echo ===================================================

echo Stopping any existing containers...
docker-compose down

echo Building and starting containers...
docker-compose up --build -d

echo Containers started! The application is now running at:
echo Frontend: http://localhost:3002
echo Backend API: http://localhost:8080
echo MySQL Database: localhost:3306

echo.
echo Note: The first startup may take some time as the database initializes
echo and the backend connects. Please be patient.
echo.
echo To view logs, run: docker-compose logs -f
echo To stop the application, run: docker-compose down
