import "express-async-errors";
import { Application } from "express";
import { Logger } from "winston";
import { winstonLogger } from "@Juandavid9909/jobber-shared";
import http from "http";

import { checkConnection } from "@notifications/elasticsearch";
import { config } from "@notifications/config";
import { healthRoutes } from "@notifications/routes";

const SERVER_PORT: number = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "notificationServer", "debug");

export const start = (app: Application): void => {
  startServer(app);

  app.use("", healthRoutes);

  startQueues();
  startElasticSearch();
};

const startQueues = async (): Promise<void> => {};

const startElasticSearch = (): void => {
  checkConnection();
};

const startServer = (app: Application): void => {
  try {
    const httpServer: http.Server = new http.Server(app);

    log.info(`Worker with process id of ${process.pid} on notification server has started`);

    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log("error", "NotificationService startServer() method:", error);
  }
};
