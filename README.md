# University Course Management System

A comprehensive system for managing university courses, students, enrollments, and academic records.

## Features

- Course Management
- Student Records
- Enrollment Processing
- Grade Tracking
- User Authentication

## Deployment Options

This project can be deployed in several ways:

### 1. Local Docker Deployment

- Uses Docker Compose to run all components locally
- Perfect for development and personal use
- See [README.DOCKER.md](./README.DOCKER.md) for details

### 2. Netlify & Railway Deployment (Recommended)

- Frontend: Deployed to Netlify
- Backend & Database: Deployed to Railway
- Full production deployment with separate environments
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions

### 3. GitHub Pages (Frontend Only)

- Simple deployment of just the frontend UI
- Limited functionality (no real data)
- Good for UI demonstrations

## Getting Started

### Prerequisites

- Docker and Docker Compose for local development
- Node.js 16+ and npm for frontend development
- Java 17+ and Maven for backend development

### Local Development Setup

1. Clone the repository
   ```
   git clone https://github.com/malkidilhara99/University_Course_Management_System.git
   cd University_Course_Management_System
   ```

2. Start the development environment
   ```
   docker-compose up -d
   ```

3. Access the application
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080

### Preparing for Deployment

Run the preparation script:
```
.\prepare-for-deploy.bat
```

Then follow the instructions in [DEPLOYMENT.md](./DEPLOYMENT.md).

## Technology Stack

- **Frontend**: React, React Router, TailwindCSS
- **Backend**: Spring Boot, Spring Security, Spring Data JPA
- **Database**: MySQL
- **Authentication**: JWT

## License

This project is licensed under the MIT License - see the LICENSE file for details.
