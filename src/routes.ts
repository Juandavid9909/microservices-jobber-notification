import { StatusCodes } from "http-status-codes";
import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

export const healthRoutes = (): Router => {
  router.get("/notification-health", (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).send("Notification service us healthy and OK.");
  });

  return router;
};
