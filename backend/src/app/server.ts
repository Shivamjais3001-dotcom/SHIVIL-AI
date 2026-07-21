// Ensure config is validated before anything else loads
import { env } from "../config/env.config";
import app from "./app";
import { logger } from "../common/logger/winston.logger";

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 [SHIVIL SERVER] Operating system server active in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

// Capture system exceptions to prevent sudden thread crashes
process.on("unhandledRejection", (err: Error) => {
  logger.error("[FATAL ERROR] Unhandled Promise Rejection:", {
    message: err.message,
    stack: err.stack,
  });
  // Graceful shutdown
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err: Error) => {
  logger.error("[FATAL ERROR] Uncaught Exception:", {
    message: err.message,
    stack: err.stack,
  });
  // Graceful shutdown
  server.close(() => {
    process.exit(1);
  });
});

// Handle termination signals
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  server.close(() => {
    logger.info("Process terminated");
    process.exit(0);
  });
});
