import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { CustomError } from "../utils/custom-error";
import { sendErrorResponse } from "../utils/response";
import { ZodError } from "zod";

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

  let statusCode = 500;
  let message = err.message || "Internal Server Error";
  let details: any = null;

  // Intercept and normalize error instances
  if (err instanceof ApiError) {
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
  } else if (err.name === "PrismaClientKnownRequestError") {
    if (err.code === "P2002") {
      statusCode = 409;
      message = "A resource with this identifier already exists (Unique constraint violation).";
      details = { target: err.meta?.target };
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Requested database record was not found.";
    } else {
      statusCode = 400;
      message = `Database constraint execution failure: ${err.message}`;
    }
  }

  // Log server-side diagnostic alert
  console.error(`[SYSTEM ERROR] ${statusCode} - ${message}`, err);

  return sendErrorResponse(res, message, statusCode, details, err.stack);
}
