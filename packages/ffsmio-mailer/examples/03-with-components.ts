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
  subject: 'Order Confirmation',
  content: `
    {@component:header}
    <div>Order details here...</div>
    {@component:footer}
  `,
});

mailer
  .setComponents({
    header: {
      content: '<header>Welcome {user.name}!</header>',
      data: { user: { name: 'John' } },
    },
    footer: {
      content: '<footer>Contact us: {contact.email}</footer>',
      data: { contact: { email: 'support@example.com' } },
    },
  })
  .send();
