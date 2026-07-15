import dotenv from "dotenv";
// Load environmental parameters first
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[SHIVIL SERVER] Operating system server active on port ${PORT}`);
});

// Capture system exceptions to prevent sudden thread crashes
process.on("unhandledRejection", (err: Error) => {
  console.error("[FATAL ERROR] Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err: Error) => {
  console.error("[FATAL ERROR] Uncaught Exception:", err);
  server.close(() => process.exit(1));
});
