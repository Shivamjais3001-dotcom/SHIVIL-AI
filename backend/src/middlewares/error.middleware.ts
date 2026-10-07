import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { CustomError } from "../utils/custom-error";
import { AppError } from "../common/errors/AppError";
import { sendErrorResponse } from "../utils/response";
import { ZodError } from "zod";
import { logger } from "../config/logger";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // If headers already sent, pass to default handler
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let details: any = err.details || null;

  // Intercept and normalize error instances
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof CustomError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Request validation failed";
    details = err.errors.map(e => ({
      field: e.path.join("."),
      message: e.message
    }));
  } else if (err.name === "PrismaClientKnownRequestError" || err.code === "P2002") {
    if (err.code === "P2002") {
      statusCode = 409;
      message = "An account with this email address already exists.";
      details = { target: err.meta?.target };
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Requested database record was not found.";
    } else {
      statusCode = 400;
      message = `Database constraint execution failure: ${err.message}`;
    }
  } else if (err.name === "PrismaClientInitializationError") {
    statusCode = 503;
    message = "Database connection unavailable. Please check database server.";
  }

  // Log server-side diagnostic alert via Winston
  logger.error(`[SYSTEM ERROR] ${statusCode} - ${message}`, {
    statusCode,
    message,
    details,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });

  return sendErrorResponse(res, message, statusCode, details, process.env.NODE_ENV === "production" ? undefined : err.stack);
}
