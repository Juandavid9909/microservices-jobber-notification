import { Logger } from "winston";
import { winstonLogger } from "@Juandavid9909/jobber-shared";
import express, { Express } from "express";

import { config } from "@notifications/config";
import { start } from "@notifications/server";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "notificationApp", "debug");

const initialize = (): void => {
  const app: Express = express();

  start(app);

  log.info("Notification Service initialized");
};

initialize();
