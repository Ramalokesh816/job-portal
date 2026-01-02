FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy Maven config
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Download dependencies first (faster builds)
RUN chmod +x mvnw && ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build the application (tests skipped)
RUN ./mvnw clean package -DskipTests

# Expose Render port
EXPOSE 8080

# Run Spring Boot app
CMD ["java", "-jar", "target/app.jar"]
