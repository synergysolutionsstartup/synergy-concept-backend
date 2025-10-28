export class AppError extends Error {
    public statusCode: number;
    public data?: unknown | null; // Optional data field
  
    constructor(message: string, statusCode: number = 500, data?: unknown) {
      super(message);
      this.statusCode = statusCode;
      this.data = data; // Assign data only if provided
      Error.captureStackTrace(this, this.constructor);
    }
  }
