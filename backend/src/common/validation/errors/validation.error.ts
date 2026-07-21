import { ZodError, ZodIssue } from "zod";

export interface ValidationErrorDetail {
  field: string;
  reason: string;
  code?: string;
}

export interface StandardValidationErrorPayload {
  success: false;
  statusCode: number;
  message: string;
  errors: ValidationErrorDetail[];
  requestId?: string;
  timestamp: string;
}

export class AppValidationError extends Error {
  public readonly statusCode: number = 400;
  public readonly errors: ValidationErrorDetail[];

  constructor(message: string, errors: ValidationErrorDetail[]) {
    super(message);
    this.name = "AppValidationError";
    this.errors = errors;
    Object.setPrototypeOf(this, AppValidationError.prototype);
  }
}

/**
 * Transforms ZodError issues into clean, client-friendly dot-notation field error details.
 */
export function formatZodError(error: ZodError): ValidationErrorDetail[] {
  return error.issues.map((issue: ZodIssue) => {
    // Strip root target prefixes like "body.", "query.", "params." for cleaner client fields
    const rawPath = issue.path.map(String);
    const fieldPath = rawPath.length > 1 && ["body", "query", "params", "headers"].includes(rawPath[0])
      ? rawPath.slice(1).join(".")
      : rawPath.join(".");

    return {
      field: fieldPath || "request",
      reason: issue.message,
      code: issue.code,
    };
  });
}
