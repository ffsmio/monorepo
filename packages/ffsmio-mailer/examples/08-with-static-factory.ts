import { MailDriver, Mailer } from '@ffsm/mailer';
import nodemailer from 'nodemailer';

Mailer.from({
  driver: nodemailer as MailDriver,
  options: {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
    from: process.env.MAILER_FROM as string,
    to: process.env.MAILER_TO as string,
    subject: 'Complete Example',
    content: '{@component:header} {message} {@component:footer}',
  },
  components: {
    header: {
      content: '<h1>{title}</h1>',
      data: { title: 'Welcome' },
    },
    footer: {
      content: '<footer>{copyright}</footer>',
      data: { copyright: '© 2025' },
    },
  },
  data: {
    message: 'Hello World!',
  },
  retry: {
    maxRetries: 3,
    delay: 1000,
  },
  rateLimit: {
    maxRequests: 100,
    interval: 60000,
  },
}).send();
