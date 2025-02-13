# @ffsm/mailer

A flexible email service with driver support, template engine, rate limiting, and retry capabilities.

## Features

- 🚗 Driver-based architecture
- 📝 Template engine with variables and loops
- 🧩 Reusable components
- 🔁 Rate limiting for bulk emails
- 🔄 Retry mechanism for failed attempts
- 📎 URL-based attachments
- 🔧 Full TypeScript support

## Installation

```bash
npm install @ffsm/mailer
# or
yarn add @ffsm/mailer
```

## Basic Usage

```typescript
import { Mailer } from '@ffsm/mailer';
import nodemailer from 'nodemailer';

const mailer = new Mailer(nodemailer, {
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'your@gmail.com',
    pass: 'your-password',
  },
  to: 'recipient@example.com',
  subject: 'Hello',
  content: 'World!',
});

await mailer.send();
```

## Using Static Factory

```typescript
const mailer = Mailer.from({
  driver: nodemailer,
  options: {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'your@gmail.com',
      password: 'your-password',
    },
    to: 'recipient@example.com',
    subject: 'Example Email',
    content: 'Content here',
  },
  components: {
    header: {
      content: '<header>{title}</header>',
      data: { title: 'Welcome' },
    },
  },
  data: {
    user: { name: 'John' },
  },
  retry: {
    maxRetries: 3,
    delay: 1000,
  },
  rateLimit: {
    maxRequests: 100,
    interval: 60000,
  },
});
```

## Template Features

### Variables

```typescript
const mailer = new Mailer(nodemailer, {
  host: 'smtp.gmail.com',
  // ... other config
  subject: 'Welcome {user.name}!',
  content: '<h1>Hello {user.name}!</h1>',
});

mailer.setData({
  user: { name: 'John' },
});
```

### Loops

```typescript
const mailer = new Mailer(nodemailer, {
  // ... config
  content: `
    {@loop:items}
      <div>{name}: ${price}</div>
    {@endloop:items}
  `,
});

mailer.setData({
  items: [
    { name: 'Item 1', price: '$100' },
    { name: 'Item 2', price: '$200' },
  ],
});
```

### Components

```typescript
const mailer = new Mailer(nodemailer, {
  // ... config
  content: `
    {@component:header}
    <div>Content</div>
    {@component:footer}
  `,
});

mailer.setComponents({
  header: {
    content: '<header>{title}</header>',
    data: { title: 'Welcome' },
  },
  footer: {
    content: '<footer>{copyright}</footer>',
    data: { copyright: '© 2025' },
  },
});
```

## Using Different Mail Drivers

The package is designed to support different mail drivers. The driver is passed as the first parameter to the Mailer constructor.

### With Nodemailer

```typescript
import nodemailer from 'nodemailer';
const mailer = new Mailer(nodemailer, options);
```

### With Custom Driver

```typescript
class CustomDriver {
  constructor(options: TransportOptions) {
    // handle options
  }

  static createTransport(options: TransportOptions) {
    return new CustomeDriver(options);
  }

  sendMail(sendOption: SendOptions) {
    // Handle send
  }

  verify() {}
}

const mailer = new Mailer(CustomDriver as MailDriver, options);
```

## API Reference

### MailerOptions

```typescript
interface MailerOptions {
  host: string; // SMTP host
  port: number; // SMTP port
  auth: {
    user: string; // SMTP username
    password: string; // SMTP password
  };
  to: MailerAddress; // Recipient(s)
  content: string; // Email content
  subject?: string; // Email subject
  from?: MailerFrom; // Sender
  cc?: MailerAddress; // CC recipients
  bcc?: MailerAddress; // BCC recipients
  replyTo?: MailerAddress; // Reply-to address
  attachments?: Array<string | Attachment>; // Attachments
  headers?: ObjectOf<string>; // Custom headers
}
```

### MailerStatic

```typescript
interface MailerStatic<T = unknown> {
  driver: any; // Mail driver (e.g., nodemailer)
  options: MailerOptions; // Configuration options
  components?: Components; // Template components
  data?: ObjectOf<T>; // Template data
  retry?: RetryOptions; // Retry configuration
  rateLimit?: RateLimitOptions; // Rate limit configuration
}
```

## TypeScript Support

```typescript
interface UserData {
  name: string;
  email: string;
}

const mailer = new Mailer<UserData>(nodemailer, {
  // ... config
});

mailer.setData({
  name: 'John', // Type checked
  email: 'john@example.com',
});
```
