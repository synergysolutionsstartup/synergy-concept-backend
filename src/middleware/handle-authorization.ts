import { constants } from "@src/common/constants";
import { AppError } from "@src/common/error/AppError";
import { utils } from "@src/common/utils/index";
import { Request, Response, NextFunction } from "express";

const verifyJwtToken = utils.tokens.verifyJwtToken;

// extend the Request class from express to be able to use the `user` property on the instance
interface AuthenticatedRequest extends Request {
  headers: any;
  user?: any; // or your actual User type/interface
}

type Role = string | string[] | undefined;

export const handleSessionAuth = (
  jwtName: string,
  requiredRole: Role = undefined
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const message = {
        invalidToken: "Invalid token. Please request new access token",
        expiredToken: "Expired access token. Please request new access token",
        forbidden: "You do not have permission to perform this action",
      };

      const authHeader = req.headers?.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError(message.invalidToken, 401);
      }

      const token = authHeader.split(" ")[1];
      const decoded = verifyJwtToken(token, jwtName, constants.jwtKeys);
      if (decoded.error) throw new AppError(message.expiredToken, 401);

      req.user = decoded.data;
      // Optional Role Check
      // Optional Role Check

      // If no requiredRole, move on
      if (!requiredRole) return next();

      // Normalize requiredRole to an array
      const rolesArray = Array.isArray(requiredRole)
        ? requiredRole
        : [requiredRole];

      if (!rolesArray.includes(req.user.role)) {
        throw new AppError(message.forbidden, 401);
      }

      next();
    } catch (error) {
      if (process.env.NODE_ENV !== "production")
        console.log("jwt middleware error ", error);
      next(error);
    }
  };
};
