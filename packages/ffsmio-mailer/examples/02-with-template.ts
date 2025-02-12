import { Mailer } from '@ffsm/mailer';

const mailer = new Mailer({
  host: 'smtp.gmail.com',
  port: 587,
  user: process.env.MAILER_USER as string,
  password: process.env.MAILER_PASSWORD as string,
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
