import { AppError } from "@src/common/error/AppError";

export class DatabaseError extends AppError {
  public error: unknown; // The original database error, if available
  constructor(message: string, statusCode: number, originalError?: unknown) {
    super(message, statusCode);
    this.name = "DatabaseError";
    this.error = originalError;
    // Optional: Capture stack trace to retain useful debugging info
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }
  }
}
