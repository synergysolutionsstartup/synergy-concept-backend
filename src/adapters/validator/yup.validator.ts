// YUP VALIDATOR IMPLEMENTATION
import { AppError } from "@src/common/error/AppError";
import * as yup from "yup";
export const Yup = yup;

export const validatePayload = async (schema: any, data: any) => {
  try {
    if (!schema) throw new Error("Validation schema is required");

    if (typeof schema.validate !== "function") {
      throw new Error("Invalid schema: must have a validate method");
    }

    await schema?.validate(data, { abortEarly: false, strict: true });

    // // CHECK IF THE ERROR UNKNOWN FIELDS ARE PRESENT
    // // 1️⃣ Get allowed keys directly from the schema shape
    // // 2️⃣ Find unknown keys in the incoming data

    const allowedKeysSet = new Set<string>();

    if (Array.isArray((schema as any)?._nodes)) {
      (schema as any)._nodes.forEach((k: string) => allowedKeysSet.add(k));
    }
    const allowedKeys = Array.from(allowedKeysSet);

    // const allowedKeys = Object.keys(schema.describe().fields);
    const unknownKeys = Object.keys(data).filter(
      (key) => !allowedKeys.includes(key)
    );
    // console.log("Allowed keys ", allowedKeys)
    // console.log("unknown keys ", unknownKeys)
    const message = `Fields can only inlude these fields [${allowedKeys.join(
      ","
    )}]`;
    if (unknownKeys.length > 0) {
      const data = { unknown: message };

      // const appError = new AppError(message, 400, data);
      throw data;
    }
  } catch (error) {
    // console.log("yup error ", error);

    // Not a validation error — return or rethrow immediately
    if (!(error instanceof yup.ValidationError)) throw error;

    // / Create an empty object to store validation error messages
    const validationErrors: Record<string, string> = {};

    // Loop through each validation error in `error.inner`
    // Ensure the error has a valid `path` (i.e., the field name)
    // Throw the formatted validation errors
    for (const validationError of error.inner) {
      if (validationError.path) {
        validationErrors[validationError.path] = validationError.message;
      }
    }
    // Otherwise, map each inner validation error

    throw validationErrors;
  }
};
