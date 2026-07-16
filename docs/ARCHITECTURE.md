# Architectural System Overview

SHIVIL AI is built to operate as a high-density, secure University Operating System.

---

## 🏛️ System Architecture

```
                       [ Client Browser ]
                               │
                       (Vite React Client)
                               ▼
                 [ Nginx Reverse Proxy (Port 80) ]
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
     (Static Assets)                       (/api/* Proxy)
    [ Vite Static Files ]          [ Express App Server (Port 5000) ]
                                                  │
                                          (Prisma ORM Link)
                                                  ▼
                                       [ PostgreSQL Database ]
```

---

## 🔑 Subsystems & Communication

### 1. Authentication & Role Scopes
JWT access tokens are generated upon authentication, defining role permission scopes:
*   `STUDENT`: Access to study planners, transcripts, attendance summaries.
*   `FACULTY`: Access to attendance check-ins, marking registers, and evaluations.
*   `ADMIN`: Unrestricted HOD workload optimization and financial forecasting.

### 2. Caching & Database Performance
*   **Prisma Client**: Governs PostgreSQL schema migrations.
*   **Redis Caching**: Caches metrics queries (total candidate registers, attendance trends) to ensure overall query latency under 400ms.
