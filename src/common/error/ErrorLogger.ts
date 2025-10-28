import { AppError } from "@src/common/error/AppError";
import { DatabaseError } from "@src/common/error/DatabaseError";

export class ErrorLogger {
  static logError(error: unknown) {
    if (error instanceof AppError) {
      if (error instanceof DatabaseError) {
        console.error(`[Database Error] ${error.message}`, error.error);
      } else {
        console.error(`[App Error] ${error.message}`);
      }
    } else {
      console.error(`[Unknown Error]`, error);
    }
  }
}
