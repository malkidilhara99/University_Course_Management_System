@echo off
echo Deploying University Course Management System frontend to GitHub Pages...

cd frontend\course-management-ui

echo Building and deploying...
npm run deploy

echo.
echo Deployment complete! The site should be available at:
echo https://malkidilhara99.github.io/University_Course_Management_System/
echo.
echo NOTE: It might take a few minutes for the changes to propagate.
echo For first-time deployments, GitHub Pages may need to be enabled in the repository settings.
echo.
echo Press any key to exit...
pause > nul
