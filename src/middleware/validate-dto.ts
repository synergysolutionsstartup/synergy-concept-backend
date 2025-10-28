// DTO MIDDLEWARE
import { NextFunction, Request, Response } from "express";
import { AppError } from "../common/error/AppError";

type SchemaType = any;
type ValidatorFunction = (
  schema: SchemaType,
  data: object
) => Promise<void> | void;

export const validateDto = (
  schema: unknown, // Strictly an object
  validate: ValidatorFunction,
  targets: Array<keyof Request> = ["body"]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Object to store the extracted data from request for validation
      const dataToValidate: Record<string, unknown> = {};
      // Loop through each target (e.g., body, params, query) and merge into dataToValidate
      for (const target of targets) {
        if (req[target]) {
          Object.assign(dataToValidate, req[target]);
        }
      }

      // console.log("dataToValidate ", dataToValidate)
      await validate(schema, dataToValidate);
      next();
    } catch (error) {
      console.error("Validate dto error:", error);
      const appError = new AppError(
        "Validation failed: Please provide all required fields",
        400,
        error
      );
      next(appError);
    }
  };
};
