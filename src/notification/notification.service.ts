import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

/**
 * NotificationService is a service that handles email notifications.
 * @class
 */
@Injectable()
export class NotificationService {
  /**
   * The transporter instance used to send emails.
   * @private
   * @type {Transporter}
   */
  private transporter: Transporter;

  /**
   * @constructor
   * Initializes the transporter with the email configuration from environment variables.
   */
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * Sends an email.
   * @async
   * @param {string} to - The recipient's email address.
   * @param {string} subject - The subject of the email.
   * @param {string} text - The text content of the email.
   * @returns {Promise<void>} A promise that resolves when the email has been sent.
   * @throws {Error} If an error occurs while sending the email.
   */
  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(`Failed to send email: ${error}`);
      throw error;
    }
  }
}
