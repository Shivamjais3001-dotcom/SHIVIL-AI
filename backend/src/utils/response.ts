import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    statusCode: number;
    details?: any;
    stack?: string;
  };
  timestamp: string;
}

export function sendSuccessResponse<T>(
  res: Response,
  data: T,
  message: string = "Request completed successfully",
  statusCode: number = 200
): Response {
  const responsePayload: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(responsePayload);
}

export function sendErrorResponse(
  res: Response,
  message: string = "An unexpected error occurred",
  statusCode: number = 500,
  details: any = null,
  stack: string | undefined = undefined
): Response {
  const responsePayload: ApiResponse = {
    success: false,
    error: {
      message,
      statusCode,
      details,
      stack: process.env.NODE_ENV === "development" ? stack : undefined,
    },
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(responsePayload);
}
