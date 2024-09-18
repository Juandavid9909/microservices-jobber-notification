import { Channel, ConsumeMessage } from "amqplib";
import { config } from "@notifications/config";
import { createConnection } from "@notifications/queues/connection";
import { Logger } from "winston";
import { winstonLogger } from "@juandavid9909/jobber-shared";

const log: Logger = winstonLogger(`${ config.ELASTIC_SEARCH_URL }`, "emailConsumer", "debug");

export const consumeAuthEmailMessages = async (channel: Channel): Promise<void> => {
  try {
    if(!channel) {
      channel = await createConnection() as Channel;
    }

    const exchangeName = "jobber-email-notification";
    const routingKey = "auth-email";
    const queueName = "auth-email-queue";

    await channel.assertExchange(exchangeName, "direct");

    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });

    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      console.log(JSON.parse(msg!.content.toString()));

      // Send emails

      // Acknowledge
      channel.ack(msg!);
    });
  } catch (error) {
    log.log("error", "NotificationService EmailConsumer consumeAuthEmailMessages() method error:", error);
  }
};

export const consumeOrderEmailMessages = async (channel: Channel): Promise<void> => {
  try {
    if(!channel) {
      channel = await createConnection() as Channel;
    }

    const exchangeName = "jobber-order-notification";
    const routingKey = "order-email";
    const queueName = "order-email-queue";

    await channel.assertExchange(exchangeName, "direct");

    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });

    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      console.log(JSON.parse(msg!.content.toString()));

      // Send emails

      // Acknowledge
      channel.ack(msg!);
    });
  } catch (error) {
    log.log("error", "NotificationService EmailConsumer consumeOrderEmailMessages() method error:", error);
  }
};
