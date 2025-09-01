### Multi-stage build for the Spring Boot backend
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /workspace

# copy pom and download dependencies first for better caching
COPY pom.xml mvnw ./
COPY .mvn .mvn
COPY src src

RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre AS runtime
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
