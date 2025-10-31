import express, { NextFunction } from "express";
import { Request, Response } from "express";
const router = express.Router();

// Define base and adapt Express requests
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = "Connected Successfully ";
    const status = "success";
    const response = { status, message, data: null };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
