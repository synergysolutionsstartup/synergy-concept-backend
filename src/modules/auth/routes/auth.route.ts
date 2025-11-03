
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

const validator = common.utils.validator

// Predefine the validator middleware
// destructure dto schemas
const { signup, login, verify, resendVerify } = authValidator;

// create the dto middlewares
const signupMiddleware = middlewares.validateDto(signup, validator.validatePayload);
const loginMiddleware = middlewares.validateDto(login, validator.validatePayload);
const verifyMiddleware = middlewares.validateDto(verify, validator.validatePayload);

const resendVerifyMiddleware = middlewares.validateDto(resendVerify, validator.validatePayload, ["params"]);

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
