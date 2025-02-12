import { Mailer } from '@ffsm/mailer';

const mailer = new Mailer({
  host: 'smtp.gmail.com',
  port: 587,
  user: process.env.MAILER_USER as string,
  password: process.env.MAILER_PASSWORD as string,
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
