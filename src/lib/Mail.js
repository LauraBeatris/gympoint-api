import nodemailer from 'nodemailer';
import mailgunTransporter from 'nodemailer-mailgun-transport';

import dotenv from 'dotenv';

import mailConfig from '../config/mail';

dotenv.config({
  path: process.env.NODE_ENV !== 'production' ? '.env.development' : '.env',
});

class Mail {
  constructor() {
    this.transporter = nodemailer.createTransport(
      mailgunTransporter({ auth: { ...mailConfig.auth } })
    );

    this.configureTemplates();
  }

  // TO DO
  configureTemplates() {}

  // Message object -> All the data expected from the template
  sendEmail(message) {
    return this.transporter.sendMail(
      {
        ...mailConfig.default,
        ...message,
      },
      (err, info) => {
        if (err) return console.log('error', err);

        return console.log('info', info);
      }
    );
  }
}

export default new Mail();
