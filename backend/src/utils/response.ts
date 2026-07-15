import { Response } from "express";

export interface ApiResponseEnvelope<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  meta: any | null;
  errors: any | null;
}

export function sendResponse<T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: T | null = null,
  meta: any | null = null,
  errors: any | null = null
): Response {
  const envelope: ApiResponseEnvelope<T> = {
    success,
    message,
    data,
    meta,
    errors
  };
  return res.status(statusCode).json(envelope);
}

export function sendSuccessResponse<T>(
  res: Response,
  data: T,
  message: string = "Request completed successfully",
  statusCode: number = 200,
  meta: any = null
): Response {
  return sendResponse(res, statusCode, true, message, data, meta, null);
}

export function sendErrorResponse(
  res: Response,
  message: string = "An unexpected error occurred",
  statusCode: number = 500,
  details: any = null,
  stack: string | undefined = undefined
): Response {
  const errorObj = {
    message,
    statusCode,
    details,
    stack: process.env.NODE_ENV === "development" ? stack : undefined
  };
  return sendResponse(res, statusCode, false, message, null, null, errorObj);
}
