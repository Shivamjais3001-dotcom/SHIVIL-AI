import { AppError } from "../common/errors/AppError";

export class ApiError extends AppError {
  public readonly details: any;

  constructor(statusCode: number, message: string, details: any = null) {
    super(message, statusCode, true);
    this.details = details;
  }

  static badRequest(message: string, details: any = null) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message: string = "Unauthorized Access", details: any = null) {
    return new ApiError(401, message, details);
  }

  static forbidden(message: string = "Access Forbidden", details: any = null) {
    return new ApiError(403, message, details);
  }

  static notFound(message: string = "Resource Not Found", details: any = null) {
    return new ApiError(404, message, details);
  }

  static conflict(message: string = "Resource Conflict", details: any = null) {
    return new ApiError(409, message, details);
  }

  static internal(message: string = "Internal Server Error", details: any = null) {
    return new ApiError(500, message, details);
  }
}
