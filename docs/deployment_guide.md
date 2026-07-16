# SHIVIL AI - Production & Beta Deployment Guide

This guide details the operational procedures, infrastructure requirements, and environment configurations needed to deploy SHIVIL AI to production and public Beta.

---

## 1. Architecture Overview

SHIVIL AI is built with a modern multi-tier decoupled architecture:
- **Frontend (Client)**: A single-page React app with TypeScript, powered by Vite. In production, it is built into static assets and served via Nginx.
- **Backend (API)**: A Node.js and Express REST API written in TypeScript, using Socket.io for WebSocket communication and Winston for logs.
- **Database Layer**: PostgreSQL managed using Prisma ORM.
- **Caching Layer**: Redis cache.
- **Orchestration**: Docker and Docker Compose for container environments.

```mermaid
graph TD
    User([Browser Client]) -->|Port 80/443| Nginx[Nginx Reverse Proxy]
    Nginx -->|Static Assets| Frontend[Vite Static HTML/JS]
    Nginx -->|/api/*| Backend[Express API Server]
    Nginx -->|/socket.io/*| Backend
    Backend -->|Prisma Client| Postgres[(PostgreSQL Database)]
    Backend -->|Redis Client| Redis[(Redis Caching Service)]
    Backend -->|Logger Streams| Winston[(Winston Log Files)]
```

---

## 2. Infrastructure Prerequisites

To deploy SHIVIL AI, ensure the host system has:
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.10+
- **Minimum Specs (Beta)**: 1 vCPU, 2GB RAM, 10GB SSD.
- **Recommended Specs (Production)**: 2 vCPU, 4GB RAM, 50GB SSD.

---

## 3. Container Orchestration (Docker Compose)

The application can be run using Docker Compose. The configuration is defined in [docker-compose.yml](file:///c:/Users/Shivam%20Jaiswal/Desktop/Campus-Nexus/docker-compose.yml) in the repository root.

### Initial Launch Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/shivil-ai/campus-nexus.git
   cd campus-nexus
   ```

2. **Configure Environment Variables**:
   Create a root `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
   Fill in the required credentials and settings (see Section 4).

3. **Build and Run the Containers**:
   ```bash
   docker-compose up -d --build
   ```

4. **Verify Container Health**:
   Wait a moment and run:
   ```bash
   docker-compose ps
   ```
   All containers should display a status of `Up` or `Up (healthy)`.

5. **Apply Database Migrations**:
   Run database migrations inside the backend container to provision the schemas:
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

6. **Seed Initial Database Records**:
   Seed default roles and configuration tables:
   ```bash
   docker-compose exec backend npx prisma db seed
   ```

---

## 4. Environment Variables Specification

The backend reads settings from environment variables. These are described below:

| Variable Name | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | No | `5000` | Port the backend process listens on inside the container. |
| `NODE_ENV` | Yes | `production` | Environment mode (`development` or `production`). |
| `DATABASE_URL` | Yes | - | PostgreSQL connection URL. Format: `postgresql://user:pass@host:5432/dbname?schema=public` |
| `REDIS_URL` | Yes | - | Connection URL for Redis cache. Format: `redis://host:port` |
| `JWT_ACCESS_SECRET` | Yes | - | Secret key used for signing JWT access tokens (min. 32 chars). |
| `JWT_REFRESH_SECRET` | Yes | - | Secret key used for signing JWT refresh tokens (min. 32 chars). |
| `CLOUDINARY_CLOUD_NAME` | Yes | - | Cloudinary storage account name. |
| `CLOUDINARY_API_KEY` | Yes | - | Cloudinary API Key. |
| `CLOUDINARY_API_SECRET` | Yes | - | Cloudinary API secret key. |
| `NODEMAILER_HOST` | Yes | - | SMTP Host server for automated transactional emails. |
| `NODEMAILER_PORT` | Yes | `587` | SMTP port number (e.g. 587 or 2525). |
| `NODEMAILER_USER` | Yes | - | Username for SMTP service authentications. |
| `NODEMAILER_PASS` | Yes | - | Password for SMTP service authentications. |
| `VITE_API_URL` | Yes | `/api` | Base URL used by the frontend compiler to send API requests. Set to `/api` for proxy. |

---

## 5. Secrets Management

> [!WARNING]
> Never commit active `.env` files to git repositories.

### Recommended Production Solutions
1. **HashiCorp Vault**: Store secrets dynamically and fetch them at container startup.
2. **AWS Secrets Manager / GCP Secret Manager**: Inject secrets as environment variables during build pipelines or dynamically link them inside AWS ECS Task Definitions or Kubernetes Pod specs.
3. **Docker Secrets**: Map keys to `/run/secrets/` files inside containers to protect variables against environment leaks.

---

## 6. Logs & Monitoring

### Logging Structure
The backend compiles log output through the Winston library.
- **Log Location**: Logs are written to `/app/logs` inside the backend container.
  - `error.log`: Captures all exceptions, status 500 errors, and system warnings.
  - `combined.log`: Captures all API routes, audits, queries, and connection reports.
- **Standard Output**: In containerized environments, Winston also outputs colorized plain text directly to the console stream, allowing log ingestion by tools like Promtail, Fluentd, or Amazon CloudWatch via Docker logging driver.

### Monitoring Health Endpoint
Verify application health via HTTP:
`GET http://<host-ip>/health`

**Success Response (200 OK)**:
```json
{
  "status": "healthy",
  "timestamp": "2026-07-16T12:00:00.000Z",
  "uptime": "342s",
  "database": "connected",
  "system": {
    "memoryRSS": "42 MB",
    "heapTotal": "28 MB",
    "heapUsed": "18 MB",
    "external": "1 MB"
  }
}
```
**Failure Response (503 Service Unavailable)**:
```json
{
  "status": "unhealthy",
  "timestamp": "2026-07-16T12:00:00.000Z",
  "uptime": "342s",
  "database": "error: database connection timed out",
  "system": {
    "memoryRSS": "42 MB",
    "heapTotal": "28 MB",
    "heapUsed": "18 MB",
    "external": "1 MB"
  }
}
```

---

## 7. Backups and Disaster Recovery

Automated scripts for database operations are located in the [scripts/](file:///c:/Users/Shivam%20Jaiswal/Desktop/Campus-Nexus/scripts/) directory.

### Backup Strategy
To trigger a manual database backup:
- **Linux/macOS**:
  ```bash
  chmod +x scripts/backup.sh
  ./scripts/backup.sh
  ```
- **Windows (PowerShell)**:
  ```powershell
  .\scripts\backup.ps1
  ```
This script creates a compressed custom-format SQL dump under the `./backups` folder and deletes backups older than 10 days.

### Disaster Recovery
To restore the database:
- **Linux/macOS**:
  ```bash
  chmod +x scripts/restore.sh
  ./scripts/restore.sh ./backups/shivil_db_backup_XXXXXXXX_XXXXXX.dump
  ```
- **Windows (PowerShell)**:
  ```powershell
  .\scripts\restore.ps1 .\backups\shivil_db_backup_XXXXXXXX_XXXXXX.dump
  ```
*Caution: The restoration drops and overwrites all existing database tables.*

---

## 8. Scaling and Production Readiness Checklist

For full enterprise production scale:
1. **SSL/TLS**: Enable HTTPS at the Nginx level using Let's Encrypt certificates.
2. **Decouple PostgreSQL**: Instead of running Postgres inside a container, use a managed database service like Amazon RDS or GCP Cloud SQL, which offers automated backups, replication, and multi-AZ deployments.
3. **Decouple Redis**: Migrate to managed Redis services like Amazon ElastiCache.
4. **Horizontal Scaling**: Deploy the backend service inside Kubernetes or AWS ECS, setting auto-scaling policies based on CPU and memory usage.
