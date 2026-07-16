# Local Installation Guide

Follow these steps to configure your local development sandbox environment for SHIVIL AI.

---

## 📋 Prerequisites
Ensure you have the following software installed:
- [Node.js](https://nodejs.org/) (Version 20+)
- [PostgreSQL](https://www.postgresql.org/) (Version 15+)
- [Redis](https://redis.io/) (Optional, used for caching)

---

## 🛠️ Step-by-Step Setup

### 1. Clone & Root Install
Clone the repository and install the shared dependencies:
```bash
git clone https://github.com/Shivamjais3001-dotcom/SHIVIL-AI.git
cd SHIVIL-AI
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` folder and the root directory, copying from the provided `.env.example` templates:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

### 3. Initialize Prisma Database
If PostgreSQL is active, generate and deploy migrations:
```bash
cd backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed
cd ..
```
*Note: If no local PostgreSQL is active, the app automatically boots in **Mock DB Fallback mode**, allowing you to execute login tests using in-memory databases.*

### 4. Boot Dev Servers
Run the dev servers simultaneously from the root directory:
```bash
npm run dev
```
*   **Vite Client**: Boots on `http://localhost:5173`
*   **Express API Server**: Runs on `http://localhost:5000`
