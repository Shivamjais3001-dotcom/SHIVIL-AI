export class ApiResponse<T> {
  public success: boolean;
  public message: string;
  public data: T | null;
  public metadata?: Record<string, any>;

  constructor(success: boolean, message: string, data: T | null = null, metadata?: Record<string, any>) {
    this.success = success;
    this.message = message;
    this.data = data;
    if (metadata) {
      this.metadata = metadata;
    }
  }

  static success<T>(message: string, data: T | null = null, metadata?: Record<string, any>): ApiResponse<T> {
    return new ApiResponse(true, message, data, metadata);
  }

  static error(message: string, metadata?: Record<string, any>): ApiResponse<null> {
    return new ApiResponse(false, message, null, metadata);
  }
}
