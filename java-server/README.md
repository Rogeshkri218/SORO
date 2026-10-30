# SORO Java Backend

This is a separate Java 21 / Spring Boot API. It does not replace or modify the existing Node.js backend or React frontend.

## Requirements

- Java 21 JDK, with `JAVA_HOME` pointing to it
- MongoDB Atlas connection string for the `soro` database
- Network access from your machine to the Atlas cluster
- The exact Vercel frontend origin for production CORS

The Maven Wrapper downloads Maven on first use; a global Maven installation is not needed.

## Configure environment

Spring Boot reads operating-system environment variables and values declared in `application.properties`; it does not load `.env` files by default. Keep the root `.env` for the existing Node.js/frontend setup. To run the Java backend locally, set these variables in the same PowerShell terminal that starts it:

```powershell
$env:MONGODB_URI = "<your MongoDB Atlas connection URI>"
$env:MONGODB_DATABASE = "soro"
$env:SERVER_PORT = "8080"
$env:CORS_ALLOWED_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"
```

For production, add the exact Vercel origin to `CORS_ALLOWED_ORIGINS`, for example:

```powershell
$env:CORS_ALLOWED_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173,https://your-project.vercel.app"
```

Replace `your-project.vercel.app` with the deployed site's exact scheme and hostname (no path or trailing slash). `java-server/.env.example` contains placeholders only; copying it to `.env` does not configure Spring Boot. Never put `MONGODB_URI` in Vite variables or frontend configuration. The Java server defaults to port `8080` when `SERVER_PORT` is not set.

## Run and test

From the repository root:

```powershell
cd java-server
.\mvnw.cmd test
.\mvnw.cmd spring-boot:run
```

The API listens on port `8080`. In another terminal, check connectivity:

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:8080/api/health
```

The health endpoint issues MongoDB's `ping` command and returns HTTP 200 only when the database responds; it returns HTTP 503 when the ping fails. Unit/controller tests verify that the ping command is issued but do not contact Atlas. To verify your configured Atlas connection, set `MONGODB_URI` and `MONGODB_DATABASE` in the backend terminal, start the app, and call `/api/health`. A response with `"status":"UP"` and `"database":"connected"` confirms the database operation succeeded. Never put the URI in frontend configuration or share it in logs or screenshots.

## Endpoints

- `GET /api/health` — API and MongoDB readiness.
- `POST /api/enquiries` — validates and saves an enquiry in `enquiries`.
- `POST /api/pcb-submissions` — validates and saves project requirements in `pcb_submissions`.

The PCB endpoint stores requirements only. It does not accept or upload files. Existing collections `users` and `orders` are exposed to the Java application only through flexible read-only BSON document repositories; no user or order API is enabled.

The existing frontend continues to call the Node backend's `/api/submissions` endpoint. Do not repoint the Vite proxy or `VITE_API_BASE_URL` to this Java API until the required submission, order-status, admin, and file-storage behavior has been migrated and separately verified.

For production, set `CORS_ALLOWED_ORIGINS` to the exact deployed Vercel origin(s) in the Java service environment. Do not use `*` for production origins.
