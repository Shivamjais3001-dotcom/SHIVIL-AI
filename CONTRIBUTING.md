# Contributing to SHIVIL AI

Thank you for your interest in contributing to SHIVIL AI! We welcome contributions to improve the efficiency, visual depth, and AI tooling capabilities of this university operating system.

---

## 🛠️ Local Development Setup

Please refer to the **[Installation Guide](file:///c:/Users/Shivam%20Jaiswal/Desktop/Campus-Nexus/docs/INSTALLATION.md)** for details on setting up Node.js, PostgreSQL, Redis, and our built-in local database mock fallbacks.

---

## 🌿 Branching Strategy

We follow a structured branching model:
*   `main`: Holds production-ready releases (`v1.x.x`).
*   `beta`: Release Candidate testing branch.
*   `feature/*` or `bugfix/*`: Developer workspaces. Create a branch here to submit pull requests.

---

## 📝 Code Style & Guidelines

1.  **TypeScript & React**: Follow standard ES6 syntax, functional React components, hooks, and strict typings.
2.  **Visual Consistency**: Use our tailwind configurations, glassmorphic layout tokens, and inline SVG indicators.
3.  **Clean Builds**: Run `npm run build` locally to verify that TypeScript compile errors do not break builds before submitting commits.
4.  **Security Checks**: Never commit plaintext connection strings or credentials. Use `.env` mappings.

---

## 📥 Submitting Pull Requests

1.  Fork the repository and checkout a local feature branch (`feature/your-addition`).
2.  Make clean commits with clear messages (`feat: add tool X`, `fix: check authentication cookies`).
3.  Push your changes and open a Pull Request (PR) targeting the `beta` branch.
4.  Verify that the GitHub Actions build and validation suites run successfully.
