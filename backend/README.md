# Backend - Running with MySQL (Docker)

This project uses Spring Boot with H2 by default and a `mysql` profile to connect to a MySQL server.

Quick start with Docker Compose (recommended):

1. Start Docker Desktop (Windows) and wait until Docker is running.
2. From the repository root run:

```powershell
docker compose up -d
```

This will start a MySQL 8.0 container named `mysql` and create database `cmsdb`.

3. Start the backend with the `mysql` profile (from `backend` folder):

```powershell
cd backend
$env:SPRING_PROFILES_ACTIVE='mysql'; .\mvnw.cmd spring-boot:run
```

4. Check endpoints:

```powershell
curl "http://localhost:8080/api/courses"
curl "http://localhost:8080/api/students"
```

Notes:
- The project already contains `application-mysql.properties` and `application.yml` profile for MySQL. The `mysql` profile points to host `mysql` so the app works with Docker Compose network.
- If you run MySQL directly (not via compose) and map to host 3306, update `application-mysql.properties` or use `application.yml` accordingly.
