import { MailDriver, Mailer } from '@ffsm/mailer';
import nodemailer from 'nodemailer';

const mailer = new Mailer(nodemailer as MailDriver, {
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD,
  },
  from: process.env.MAILER_FROM as string,
  to: process.env.MAILER_TO as string,
  subject: 'Welcome {user.name}!',
  content: `
    <h1>Welcome {user.name}!</h1>
    <p>Your order number is {order.id}</p>
    <div>Items:</div>
    {@loop:items}
      <div>{items:name}: \${items:price}</div>
    {@endloop:items}
  `,
});

mailer.send();
