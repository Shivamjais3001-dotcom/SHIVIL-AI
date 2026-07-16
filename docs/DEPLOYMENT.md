# Production Deployment Guide

This guide details instructions to deploy SHIVIL AI on target enterprise staging servers using Docker Compose.

---

## 🐳 Docker Orchestration

We orchestrate production services using four containers in `docker-compose.yml`:
1.  **db**: PostgreSQL 15 database instance.
2.  **redis**: Redis cache engine.
3.  **backend**: Express API runner executing under Node 20 runtime.
4.  **frontend**: Nginx web server mapping client files and routing proxy endpoints.

### Deploy Command
Run the build command from the root workspace:
```bash
docker-compose up --build -d
```

---

## 🔌 Nginx Configuration (`nginx.conf`)

Our custom Nginx configuration proxies calls:
*   Incoming HTTP/HTTPS traffic to the static React client build (`dist/`).
*   `/api/` route requests are reverse-proxied to `http://backend:5000`.
*   Includes double-prefix normalizations `/api/api/` and WebSocket socket.io mappings.

---

## 📝 Logging Pipelines

*   **Stdout Logs**: Container stdout is mapped for log indexing (`docker compose logs -f`).
*   **Winston Log files**: Server exceptions are written to `/app/logs/error.log` inside the backend container.

---

## 💾 Automated Backups

Configure a Cron utility in the server host to run our backup scripts:
```bash
# Run database backups daily at 02:00 AM
0 2 * * * /bin/bash /opt/shivil-ai/scripts/backup.sh >> /var/log/shivil-backup.log 2>&1
```
*For Windows environments, configure the PowerShell task scheduler to trigger `scripts/backup.ps1`.*
