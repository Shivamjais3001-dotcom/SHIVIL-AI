import winston from "winston";
import path from "path";
import fs from "fs";
import { env } from "../../config/env.config";

// Ensure logs directory exists
const logsDirectory = path.join(__dirname, "../../../../logs");
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, { recursive: true });
}

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
  },
};

winston.addColors(customLevels.colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => {
      const { timestamp, level, message, stack, requestId } = info;
      const reqId = requestId ? ` [ReqID: ${requestId}]` : "";
      return `${timestamp} ${level}${reqId}: ${message}${stack ? `\n${stack}` : ""}`;
    }
  )
);

const transports = [
  new winston.transports.Console({
    format: consoleFormat,
  }),
  new winston.transports.File({
    filename: path.join(logsDirectory, "error.log"),
    level: "error",
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  new winston.transports.File({
    filename: path.join(logsDirectory, "combined.log"),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  levels: customLevels.levels,
  format,
  transports,
  exitOnError: false, // Do not exit on handled exceptions
});

export default logger;
