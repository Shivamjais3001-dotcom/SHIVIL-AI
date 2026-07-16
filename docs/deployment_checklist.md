# SHIVIL AI - Production & Beta Deployment Checklist

This document contains step-by-step checklists to guide the release team during pre-flight preparation, the launch window, and post-launch verification.

---

## 1. Pre-Flight Preparation Checklist

Perform these checks at least **24 hours before** the target launch window:

- [ ] **Infrastructure Provisioning**:
  - [ ] Virtual Machine / EC2 instance is created with at least 2GB RAM and 10GB SSD.
  - [ ] Ports `80` (HTTP) and `443` (HTTPS) are open in the security group/firewall rules.
- [ ] **Docker Engine Readiness**:
  - [ ] Docker is installed and running (`docker --version`).
  - [ ] Docker Compose is installed and running (`docker-compose --version`).
- [ ] **Environment Verification**:
  - [ ] Production `.env` file is generated and populated with production-grade credentials.
  - [ ] Secrets (such as JWT keys) are generated with a length of at least 32 characters.
  - [ ] SMTP service details are validated using a tool like Mailtrap or a production gateway.
  - [ ] Cloudinary storage credentials are valid.
- [ ] **Source Validation**:
  - [ ] The build branch (e.g., `beta` or `main`) has successfully completed the CI pipeline.
  - [ ] All lint and TypeScript compilations are green.

---

## 2. Launch Window Checklist

Execute these tasks during the scheduled deployment window:

- [ ] **Step 1: Pull Target Code**:
  - [ ] Pull the latest validated release tag:
    ```bash
    git fetch --tags
    git checkout tags/v1.0.0-beta
    ```
- [ ] **Step 2: Setup Environment Variables**:
  - [ ] Copy the secure production environment config into the root directory:
    ```bash
    cp /secure/path/to/production.env .env
    ```
- [ ] **Step 3: Service Orchestration**:
  - [ ] Run the Docker Compose build and start the containers in detached mode:
    ```bash
    docker-compose up -d --build
    ```
- [ ] **Step 4: Database Schema Provisioning**:
  - [ ] Deploy Prisma database schemas and schemas migrations:
    ```bash
    docker-compose exec backend npx prisma migrate deploy
    ```
- [ ] **Step 5: Database Seeding**:
  - [ ] Populate database tables with standard default configuration and seed records:
    ```bash
    docker-compose exec backend npx prisma db seed
    ```
- [ ] **Step 6: Confirm Operational Uptime**:
  - [ ] Check container states:
    ```bash
    docker-compose ps
    ```
    Ensure `shivil_postgres`, `shivil_redis`, `shivil_backend`, and `shivil_frontend` are active and green.

---

## 3. Post-Launch & Health Verification Checklist

Complete these checks immediately after container startup to confirm deployment success:

- [ ] **REST API & Health Check Route**:
  - [ ] Send request to backend health check:
    ```bash
    curl http://localhost/health
    ```
    Validate that the database connection status reads `"connected"` and system resource usage is populated.
- [ ] **Winston File Log Verification**:
  - [ ] Ensure logger directory and output files are created:
    ```bash
    docker-compose exec backend ls -la /app/logs
    ```
    Confirm both `combined.log` and `error.log` exist and have correct permissions.
- [ ] **Console Log Inspection**:
  - [ ] Check backend output for any startup exceptions:
    ```bash
    docker-compose logs backend
    ```
- [ ] **Frontend Accessibility**:
  - [ ] Navigate to the application root via a browser: `http://<your-server-ip>/`
  - [ ] Verify page loads and displays the login dashboard screen.
- [ ] **User Authentication Check**:
  - [ ] Log in with a seed account (e.g., student or admin).
  - [ ] Confirm a JWT access token is generated, stored, and sent in subsequent REST headers.
- [ ] **WebSocket Communication Check**:
  - [ ] Check browser developer tools (Network tab -> WS) to verify the socket.io client connection to `/socket.io/` is established.
- [ ] **Backup Verification (Dry Run)**:
  - [ ] Test the database backup script on the host to ensure it functions:
    ```bash
    ./scripts/backup.sh
    ```
    Confirm a new custom SQL dump file `.dump` is generated in the `./backups` directory.
