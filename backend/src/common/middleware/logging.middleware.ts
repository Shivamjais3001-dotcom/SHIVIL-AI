import morgan from "morgan";
import { logger } from "../logger/winston.logger";
import { Request } from "express";

// Define custom morgan token for request ID
morgan.token("id", (req: Request) => req.requestId || "-");

// Custom format combining all required fields
const morganFormat = ":id :remote-addr :method :url :status :res[content-length] - :response-time ms";

export const loggingMiddleware = morgan(morganFormat, {
  stream: {
    // Write morgan logs to winston at 'http' level
    write: (message: string) => {
      // Remove trailing newline added by morgan
      logger.http(message.trim());
    },
  },
});
