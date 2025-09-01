Quick Docker setup

This repo includes a Docker configuration to run MySQL, the Spring Boot backend, and the built frontend.

Requirements
- Docker and Docker Compose installed on your machine.

Start everything

From the project root:

```bash
docker compose up --build
```

Access points
- Frontend: http://localhost:3002
- Backend: http://localhost:8080 (API under /api)

Notes
- Backend connects to the MySQL service using JDBC URL: jdbc:mysql://mysql:3306/university_cms
- The frontend is served by nginx on container port 80 and mapped to host 3002.
- To view backend logs:
  docker logs -f ucms_backend

Cleanup
- Stop and remove containers:
  docker compose down -v

If you'd like, I can:
- Add healthchecks to the compose services.
- Configure environment files with secrets.
- Add a Makefile for convenience targets.
