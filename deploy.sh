#!/bin/bash
# Deployment script for University Course Management System
# This script builds Docker images and pushes them to Docker Hub

# Change these variables to match your Docker Hub username
DOCKER_USERNAME="yourusername"
BACKEND_IMAGE_NAME="ucms-backend"
FRONTEND_IMAGE_NAME="ucms-frontend"
VERSION="latest"

echo "========== Building and pushing Docker images =========="
echo "Docker Hub Username: $DOCKER_USERNAME"
echo "Backend Image: $BACKEND_IMAGE_NAME:$VERSION"
echo "Frontend Image: $FRONTEND_IMAGE_NAME:$VERSION"

# Login to Docker Hub
echo "Logging into Docker Hub..."
docker login

# Build and push backend image
echo "Building backend image..."
cd backend
docker build -t $DOCKER_USERNAME/$BACKEND_IMAGE_NAME:$VERSION .
echo "Pushing backend image to Docker Hub..."
docker push $DOCKER_USERNAME/$BACKEND_IMAGE_NAME:$VERSION
cd ..

# Build and push frontend image
echo "Building frontend image..."
cd frontend/course-management-ui
docker build -t $DOCKER_USERNAME/$FRONTEND_IMAGE_NAME:$VERSION .
echo "Pushing frontend image to Docker Hub..."
docker push $DOCKER_USERNAME/$FRONTEND_IMAGE_NAME:$VERSION
cd ../..

echo "========== Deployment preparation complete! =========="
echo "Images are now available at:"
echo "- $DOCKER_USERNAME/$BACKEND_IMAGE_NAME:$VERSION"
echo "- $DOCKER_USERNAME/$FRONTEND_IMAGE_NAME:$VERSION"
echo ""
echo "Next steps:"
echo "1. Use these images in deployment to Render/Heroku/Railway"
echo "2. Set the required environment variables as described in DEPLOYMENT.md"
echo "3. Configure the database connection"
echo ""
echo "For detailed deployment instructions, see DEPLOYMENT.md"
