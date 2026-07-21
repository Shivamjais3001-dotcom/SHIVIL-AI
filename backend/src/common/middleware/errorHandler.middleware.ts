import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ApiResponse } from "../responses/ApiResponse";
import { logger } from "../logger/winston.logger";
import { env } from "../../config/env.config";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let metadata: any = {};

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "ValidationError" || err.name === "ZodError") {
    statusCode = 400;
    message = "Validation Error";
    metadata = err;
  } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication Error: Invalid or expired token";
  } else {
    // Unexpected error, log it
    logger.error("Unhandled Exception:", {
      message: err.message,
      stack: err.stack,
      requestId: req.requestId,
      path: req.path,
      method: req.method,
    });
  }

  // Do not send stack traces in production
  if (env.NODE_ENV === "development" && !(err instanceof AppError)) {
    metadata.stack = err.stack;
  }

  res.status(statusCode).json(ApiResponse.error(message, metadata));
};
