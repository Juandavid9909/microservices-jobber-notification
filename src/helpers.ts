import path from "path";

import { config } from "@notifications/config";
import { IEmailLocals, winstonLogger } from "@juandavid9909/jobber-shared";
import { Logger } from "winston";
import Email from "email-templates";
import nodemailer, { Transporter } from "nodemailer";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "mailTransportHelper", "debug");

export const emailTemplates = async (template: string, receiver: string, locals: IEmailLocals): Promise<void> => {
  try {
    const smtpTransport: Transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD
      }
    });

    const email: Email = new Email({
      message: {
        from: `Jobber App <${config.SENDER_EMAIL}>`
      },
      send: true,
      preview: false,
      transport: smtpTransport,
      views: {
        options: {
          extension: "ejs"
        }
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, "../build")
        }
      }
    });

    await email.send({
      template: path.join(__dirname, "..", "src/emails", template),
      message: { to: receiver },
      locals
    });
  } catch (error) {
    log.error(error);
  }
};
