import { Channel, ConsumeMessage } from "amqplib";
import { config } from "@notifications/config";
import { createConnection } from "@notifications/queues/connection";
import { IEmailLocals, winstonLogger } from "@juandavid9909/jobber-shared";
import { Logger } from "winston";
import { sendEmail } from "@notifications/queues/mail.transport";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "emailConsumer", "debug");

export const consumeAuthEmailMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }

    const exchangeName = "jobber-email-notification";
    const routingKey = "auth-email";
    const queueName = "auth-email-queue";

    await channel.assertExchange(exchangeName, "direct");

    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });

    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg!.content.toString());
      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: "https://i.ibb.co/Kyp2m0t/cover.png",
        username,
        verifyLink,
        resetLink
      };

      await sendEmail(template, receiverEmail, locals);

      channel.ack(msg!);
    });
  } catch (error) {
    log.log("error", "NotificationService EmailConsumer consumeAuthEmailMessages() method error:", error);
  }
};

export const consumeOrderEmailMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }

    const exchangeName = "jobber-order-notification";
    const routingKey = "order-email";
    const queueName = "order-email-queue";

    await channel.assertExchange(exchangeName, "direct");

    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });

    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const {
        receiverEmail,
        username,
        template,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total
      } = JSON.parse(msg!.content.toString());

      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: "https://i.ibb.co/Kyp2m0t/cover.png",
        username,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total
      };

      await sendEmail(template, receiverEmail, locals);

      if (template === "orderPlaced") {
        await sendEmail("orderReceipt", receiverEmail, locals);
      }

      channel.ack(msg!);
    });
  } catch (error) {
    console.log(error);
    log.log("error", "NotificationService EmailConsumer consumeOrderEmailMessages() method error:", error);
  }
};
