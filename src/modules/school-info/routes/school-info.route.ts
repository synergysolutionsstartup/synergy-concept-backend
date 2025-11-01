import express, { NextFunction } from "express";
import { Request, Response } from "express";

// OUTSIDE IMPORTS
import { db } from "@src/database/_index/index";
import { common } from "@src/common/_index";
import { middlewares } from "@src/middleware/_index";

// MODULE IMPORTS
import { SchoolInfoDao } from "@src/modules/school-info/dao/_index";
import { dtoSchemaRepo } from "@src/modules/school-info/validator/_index";
import { SchoolInfoController } from "@src/modules/school-info/controllers/_index";

// Initilize PROPS AND Dependencies
const router = express.Router();
const daoInstance = SchoolInfoDao(db.dbClient);

const appDao = db.AppDao(db.dbClient, db.parseDbError);
const controllerInstance = SchoolInfoController();

const validator = common.utils.validator;
const { handleSessionAuth, validateDto } = middlewares;

const constants = common.constants;

// Predefine the validator middleware
// destructure dto schemas
const { createSchool, updateSchool, readSchoolInfo } = dtoSchemaRepo;

// create the dto middlewares
const createSchoolMiddleware = validateDto(
  createSchool,
  validator.validatePayload
);
const updateSchoolMiddleware = validateDto(
  updateSchool,
  validator.validatePayload
);
const readSchoolInfoMiddleware = validateDto(
  readSchoolInfo,
  validator.validatePayload,
  ["query"]
);

// only super admins can access the POST & PUT Routes
const permission = {
  create: [constants.userRole.superAdmin],
  update: [constants.userRole.superAdmin],
};

const createSession = handleSessionAuth(
  constants.jwtKeys.access,
  permission.create
);
const createGuard = [createSession, createSchoolMiddleware];
router.post(
  "/",
  createGuard,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log("reacherd the request")
      const { user }: Record<string, any> = req as unknown as any;
      const props = {
        body: req.body,
        dao: daoInstance,
        route: "create",
        requestId: user.id,
        appDao: appDao,
      };
      console.log("props ", props);
      const response = await controllerInstance.save(props);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
);

const updateSession = handleSessionAuth(
  constants.jwtKeys.access,
  permission.update
);
const updateGuard = [updateSession, updateSchoolMiddleware];
router.put(
  "/",
  updateGuard,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user }: Record<string, any> = req as unknown as any;

      const props = {
        body: req.body,
        dao: daoInstance,
        route: "update",
        requestId: user.id,
        appDao: appDao,
      };

      const response = await controllerInstance.save(props);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/",
  readSchoolInfoMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query;
      const props = { dao: daoInstance, query };
      const response = await controllerInstance.read(props);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
