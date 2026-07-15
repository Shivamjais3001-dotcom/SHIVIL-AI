export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details: any;

  constructor(statusCode: number, message: string, details: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
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
