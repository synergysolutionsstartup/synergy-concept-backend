import { AppError } from "@src/common/error/AppError";
import { NextFunction, Request, Response } from "express";

export const handleGlobalErrors = async (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // CHECK IF IT IS AN INSTANCE OF APP ERROR AND RETURN ACCORDINGLY
  // Logger.logError(err); // 🔥 Now logging is separate from response handling 
  console.log("globalErrorHandler error", error)

  if (error instanceof AppError) {
    console.log("instance of APP error")
    const json = { status: "error", message: error.message, data: error.data };
    return res.status(error.statusCode).json(json);
  }

  const statusCode = 500;
  const json = {
    status: "error",
    message: "There was an internal server error. Try again",
    data: null,
  };
  res.status(statusCode).json(json);
};
