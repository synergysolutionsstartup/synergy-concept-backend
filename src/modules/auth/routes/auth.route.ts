
import express, { NextFunction } from "express";
import { Request, Response } from "express";

// OUTSIDE IMPORTS
import { db } from "@src/database/_index/index";
import { common } from "@src/common/_index";
import { middlewares } from "@src/middleware/_index";


// MODULE IMPORTS
import { AuthController } from "@src/modules/auth/controllers/_index";
import { AuthDao } from "@src/modules/auth/dao/_index";
import { authValidator } from "@src/modules/auth/validator/_index";


// Initilize PROPS AND Dependencies
const router = express.Router();
const daoInstance = AuthDao(db.dbClient, db.parseDbError);

const controllerInstance = AuthController();

const validator = common.utils.validator;
const constants = common.constants;
const AppError = common.errors.AppError;

const adminOrSuperAdminAuth = middlewares.handleSessionAuth(
  constants.jwtKeys.access,
  [constants.userRole.admin, constants.userRole.superAdmin]
);
const superAdminAuth = middlewares.handleSessionAuth(
  constants.jwtKeys.access,
  [constants.userRole.superAdmin]
);

// Predefine the validator middleware
// destructure dto schemas
const { signup, login, verify, readUsers, resendVerify, createSuperAdmin, approveAdmin, approveManyAdmins } = authValidator;

// create the dto middlewares
const signupMiddleware = middlewares.validateDto(signup, validator.validatePayload);
const loginMiddleware = middlewares.validateDto(login, validator.validatePayload);
const verifyMiddleware = middlewares.validateDto(verify, validator.validatePayload);
const readUsersMiddleware = middlewares.validateDto(readUsers, validator.validatePayload, ["query"]);
const createSuperAdminMiddleware = middlewares.validateDto(createSuperAdmin, validator.validatePayload);
const approveAdminMiddleware = middlewares.validateDto(approveAdmin, validator.validatePayload, ["params"]);
const approveManyAdminsMiddleware = middlewares.validateDto(approveManyAdmins, validator.validatePayload);

const resendVerifyMiddleware = middlewares.validateDto(resendVerify, validator.validatePayload, ["params"]);

const internalApiKey = process.env.INTERNAL_API_KEY;
const internalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const headerKey = req.headers["internal-api-key"] as string | undefined;
  if (!internalApiKey || headerKey !== internalApiKey) {
    return next(new AppError("Unauthorized", 401));
  }
  return next();
};

// Define routes and adapt Express requests
router.post(
  "/signup",
  signupMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const props = { body: req.body, dao: daoInstance };
      const response = await controllerInstance.signup(props);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  loginMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
       const props = {body: req.body, dao: daoInstance}
      const response = await controllerInstance.login(props);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/internal/superadmin",
  internalAuth,
  createSuperAdminMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const props = { body: req.body, dao: daoInstance };
      const response = await controllerInstance.createSuperAdmin(props);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/admins",
  superAdminAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await controllerInstance.readAdmins({ dao: daoInstance });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/users",
  adminOrSuperAdminAuth,
  readUsersMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await controllerInstance.readUsers({
        dao: daoInstance,
        requestUser: (req as any).user,
        role: req.query.role as string | undefined,
      });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/admins/:id/approve",
  superAdminAuth,
  approveAdminMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const props = { id: req.params.id as string, dao: daoInstance };
      const response = await controllerInstance.approveAdmin(props);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/admins/approve-many",
  superAdminAuth,
  approveManyAdminsMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const props = { ids: req.body.ids, dao: daoInstance };
      const response = await controllerInstance.approveManyAdmins(props);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/verify",
  verifyMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const props = {body: req.body, dao: daoInstance}
      const response = await controllerInstance.verify(props);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/verify/:email",
  resendVerifyMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.params.email as string
       const props = {email, dao: daoInstance}
      const response = await controllerInstance.resendVerification(props);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// router.get(
//   "/init-account/:email",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const response = await controllerInstance.autoSignin(req.params?.email);
//       res.status(200).json(response);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// router.get(
//   "/refresh-access-token/:email",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const response = await controllerInstance.refreshAccessToken(
//         req.params?.email
//       );
//       res.status(200).json(response);
//     } catch (error) {
//       next(error);
//     }
//   }
// );


export default router;
