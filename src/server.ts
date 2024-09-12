import "express-async-errors";
import http from "http";

import { Application } from "express";
import { checkConnection } from "@notifications/elasticsearch";
import { config } from "@notifications/config";
import { createConnection } from "@notifications/queues/connection";
import { healthRoutes } from "@notifications/routes";
import { Logger } from "winston";
import { winstonLogger } from "@juandavid9909/jobber-shared";

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${ config.ELASTIC_SEARCH_URL }`, "notificationServer", "debug");

export const start = (app: Application): void => {
  startServer(app);

  app.use("", healthRoutes);

  startQueues();
  startElasticSearch();
};

export const startQueues = async (): Promise<void> => {
  await createConnection();
};

const startElasticSearch = (): void => {
  checkConnection();
};

const startServer = (app: Application): void => {
  try {
    const httpServer: http.Server = new http.Server(app);

    log.info(`Worker with process id of ${ process.pid } on notification server has started`);

    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${ SERVER_PORT }`);
    });
  } catch (error) {
    log.log("error", "NotificationService startServer() method: ", error);
  }
};
