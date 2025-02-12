import { Mailer } from '@ffsm/mailer';

const mailer = new Mailer({
  host: 'smtp.gmail.com',
  port: 587,
  user: process.env.MAILER_USER as string,
  password: process.env.MAILER_PASSWORD as string,
  from: process.env.MAILER_FROM as string,
  to: process.env.MAILER_TO as string,
  subject: 'Documents Attached',
  content: 'Please find the documents attached.',
  attachments: [
    'https://example.com/document.pdf',
    {
      path: 'https://example.com/image.jpg',
      filename: 'company-logo.jpg',
    },
  ],
});

mailer.send();
