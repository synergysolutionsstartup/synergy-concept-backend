import { AppError } from "@src/common/error/AppError";
import { NextFunction, Request, Response } from "express";

export const handleInvalidRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const message = `Can't find ${req.originalUrl} on this server!`;
   const message = `Can't find the requested route on the server `;
  const error = new AppError(message, 404);
  next(error); // Passes the error to the global error handler
};
