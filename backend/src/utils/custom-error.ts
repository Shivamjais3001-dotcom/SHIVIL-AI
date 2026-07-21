import { AppError as CentralAppError } from "../common/errors/AppError";

export class CustomError extends CentralAppError {
  public readonly details: any;

  constructor(message: string, statusCode: number = 500, details: any = null) {
    super(message, statusCode, true);
    this.details = details;
  }
}

export { CentralAppError as AppError };

export class BadRequestError extends CustomError {
  constructor(message: string = "Bad Request", details: any = null) {
    super(message, 400, details);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string = "Validation Failed", details: any = null) {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = "Unauthorized Access", details: any = null) {
    super(message, 401, details);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = "Access Forbidden", details: any = null) {
    super(message, 403, details);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = "Resource Not Found", details: any = null) {
    super(message, 404, details);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = "Resource Conflict", details: any = null) {
    super(message, 409, details);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string = "Internal Server Error", details: any = null) {
    super(message, 500, details);
  }
}
