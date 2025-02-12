import { Mailer } from '@ffsm/mailer';

const mailer = new Mailer({
  host: 'smtp.gmail.com',
  port: 587,
  user: process.env.MAILER_USER as string,
  password: process.env.MAILER_PASSWORD as string,
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
