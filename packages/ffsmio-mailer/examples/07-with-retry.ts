import { MailDriver, Mailer } from '@ffsm/mailer';
import nodemailer from 'nodemailer';

const mailer = new Mailer(nodemailer as MailDriver, {
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.MAILER_USER as string,
    pass: process.env.MAILER_PASSWORD as string,
  },
  from: process.env.MAILER_FROM as string,
  to: process.env.MAILER_TO as string,
  subject: 'Important Mail',
  content: 'Must be delivered...',
});

mailer
  .setRetry({
    maxRetries: 3,
    delay: 1000,
  })
  .send();
