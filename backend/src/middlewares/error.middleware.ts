import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/custom-error";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // If headers already sent, pass to default handler
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";
  const details = err instanceof CustomError ? err.details : null;

  // Log server-side diagnostic alert
  console.error(`[SYSTEM ERROR] ${statusCode} - ${message}`, err);

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      details,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    }
  });
}
