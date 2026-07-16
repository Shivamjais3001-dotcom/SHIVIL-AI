# Changelog

All notable changes to the SHIVIL AI project will be documented in this file.

---

## [1.0.0-beta] - 2026-07-16

### Added
*   **Actionable AI Tool Registry**: Added 18 tools (dropout risk model, resume parsing, workload balancer, outstanding ledger summaries) in `aiCore.ts`.
*   **Sensitive Actions Confirmation Gates**: Added UI validation triggers for transcripts generation and class grades execution.
*   **Multi-Role Dashboards**: Rebuilt `Dashboard.tsx` to dynamically render unique interfaces for Students, Faculty, HODs, Finance, and Placement officers.
*   **Admin Mode Switcher**: Renders a header panel swapper for Admin accounts.
*   **Keyboard Command Palette**: Binds `Ctrl+K` to search actions.
*   **PowerShell Backup Scripts**: Native Windows backup/restore scripts (`scripts/backup.ps1`).

### Fixed
*   **Mock Database Fallback**: Implemented an in-memory db client inside `database.ts` to prevent app startup crashes when running local sandboxes without active PostgreSQL connections.

### Infrastructure & Operations
*   **Multi-stage Dockerfiles**: Production image builds for backend Express and frontend Nginx routing.
*   **Reverse Proxy Normalizer**: Nginx rule to bypass double-prefix routing errors (`/api/api/`).
*   **Winston Logging middleware**: Logs backend warnings to `/app/logs/error.log`.
