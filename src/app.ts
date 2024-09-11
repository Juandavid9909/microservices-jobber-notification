import { config } from "@notifications/config";
import { Logger } from "winston";
import { start } from "@notifications/server";
import { winstonLogger } from "@juandavid9909/jobber-shared";
import express, { Express } from "express";

const log: Logger = winstonLogger(`${ config.ELASTIC_SEARCH_URL }`, "notificationApp", "debug");

const initialize = (): void => {
  const app: Express = express();

  start(app);

  log.info("Notification service initialized");
};

initialize();
