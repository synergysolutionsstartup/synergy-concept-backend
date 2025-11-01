import express, { NextFunction } from "express";
import { Request, Response } from "express";

// OUTSIDE IMPORTS
import { db } from "@src/database/_index/index";
import { common } from "@src/common/_index";
import { middlewares } from "@src/middleware/_index";

// MODULE IMPORTS
import { SessionDao } from "@src/modules/session/dao/_index";
import { dtoSchemaRepo } from "@src/modules/session/validator/_index";
import { SessionController } from "@src/modules/session/controllers/_index";
import { AccountResponseDTO } from "@src/_types/account/dto.type";

// Initilize PROPS AND Dependencies
const router = express.Router();
const daoInstance = SessionDao(db.dbClient, db.parseDbError);
// const appDao = db.AppDao(db.dbClient, db.parseDbError);

const controller = SessionController();

const validator = common.utils.validator;
const { handleSessionAuth, validateDto } = middlewares;

const constants = common.constants;

// Predefine the validator middleware
const { create, update, read, readInfo } = dtoSchemaRepo;

// create the dto middlewares
const createDtoMiddleware = validateDto(create, validator.validatePayload);
const updateDtoMiddleware = validateDto(update, validator.validatePayload);
const readInfoMiddleware = validateDto(readInfo, validator.validatePayload, [
  "params",
]);
const readAllDtoMiddleware = validateDto(read, validator.validatePayload, [
  "params",
]);

// only super admins can access the POST & PUT Routes
const permission = {
  create: [constants.userRole.superAdmin],
  update: [constants.userRole.superAdmin],
  remove: [constants.userRole.superAdmin],
};

const createSession = handleSessionAuth(
  constants.jwtKeys.access,
  permission.create
);
const createGuard = [createSession, createDtoMiddleware];

router.post(
  "/",
  createGuard,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: AccountResponseDTO = (req as any).user;
      const props = { body: req.body, dao: daoInstance, requestUser: user };
      const response = await controller.save(props);
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
const updateGuard = [updateSession, updateDtoMiddleware];
router.put(
  "/",
  updateGuard,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: AccountResponseDTO = (req as any).user;
      const props = { body: req.body, dao: daoInstance, requestUser: user };
      const response = await controller.update(props);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

const deleteSession = handleSessionAuth(
  constants.jwtKeys.access,
  permission.update
);
const deleteGuard = [deleteSession, readInfoMiddleware];
router.delete(
  "/:id",
  deleteGuard,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = req.params;
      const props = { dao: daoInstance, id: params.id as string };
      const response = await controller.remove(props);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// CAN BE ACCESSED BY ROLE
router.get(
  "/info/:id",
  readInfoMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = req.params;
      const props = { dao: daoInstance, id: params.id as string };
      const response = await controller.readInfo(props);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// CAN BE ACCESSED BY ANYOLE
router.get(
  "/all/:schoolId",
  readAllDtoMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = req.params;
      const props = { dao: daoInstance, schoolId: params.schoolId as string };
      const response = await controller.read(props);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
