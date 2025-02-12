# @ffsm/mailer

A flexible email sending package for Node.js with template support, rate limiting, and retry capabilities.

## Features

- 📧 Simple and intuitive API
- 📝 Template support with variables and loops
- 🧩 Reusable components
- 🔁 Rate limiting for bulk emails
- 🔄 Retry mechanism for failed attempts
- 📎 URL-based attachments
- 🔧 Fully typed with TypeScript

## Installation

```bash
npm install @ffsm/mailer
```

## Basic Usage

```typescript
import { Mailer } from '@ffsm/mailer';

const mailer = new Mailer({
  host: 'smtp.gmail.com',
  port: 587,
  user: 'your@gmail.com',
  password: 'your-password',
  to: 'recipient@example.com',
  subject: 'Hello',
  content: 'World!',
});

await mailer.send();
```

## Template System

The mailer includes a powerful template system that supports variables, loops, and components.

### Variables

Use curly braces to insert variables:

```typescript
const mailer = new Mailer({
  // ... config
  subject: 'Welcome {user.name}!',
  content: '<h1>Hello {user.name}!</h1><p>Your ID is {user.id}</p>',
});

mailer.setData({
  user: {
    name: 'John',
    id: '12345',
  },
});
```

### Loops

Use @loop syntax for iterating over arrays:

```typescript
const mailer = new Mailer({
  // ... config
  content: `
    <h1>Your Items:</h1>
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

Create reusable components for template parts:

```typescript
const mailer = new Mailer({
  // ... config
  content: `
    {@component:header}
    <div>Main content</div>
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

## Attachments

Support both simple URLs and configuration objects:

```typescript
const mailer = new Mailer({
  // ... config
  attachments: [
    'https://example.com/document.pdf',
    {
      path: 'https://example.com/image.jpg',
      filename: 'custom-name.jpg',
    },
  ],
});
```

## Rate Limiting

Control email sending rate:

```typescript
mailer.setRateLimit({
  maxRequests: 100, // Maximum emails per interval
  interval: 60000, // Interval in milliseconds (1 minute)
});
```

## Retry Mechanism

Add retry capability for failed attempts:

```typescript
mailer.setRetry({
  maxRetries: 3, // Maximum retry attempts
  delay: 1000, // Delay between retries in milliseconds
});
```

## Advanced Usage

### Static Factory Method

Create mailer instance with all configurations:

```typescript
const mailer = Mailer.from({
  options: {
    // Basic options
    host: 'smtp.gmail.com',
    port: 587,
    user: 'user',
    password: 'pass',
    to: 'recipient@example.com',
    subject: 'Subject',
    content: 'Content',
  },
  // Template components
  components: {
    header: {
      content: '<header>{title}</header>',
      data: { title: 'Welcome' },
    },
  },
  // Template data
  data: {
    user: { name: 'John' },
  },
  // Retry configuration
  retry: {
    maxRetries: 3,
    delay: 1000,
  },
  // Rate limit configuration
  rateLimit: {
    maxRequests: 100,
    interval: 60000,
  },
});
```

### Multiple Recipients

Support various recipient formats:

```typescript
const mailer = new Mailer({
  // ... config
  to: ['user1@example.com', 'user2@example.com'],
  cc: 'cc@example.com',
  bcc: ['bcc1@example.com', 'bcc2@example.com'],
  replyTo: 'reply@example.com',
});
```

## API Reference

### MailerOptions

Main configuration interface:

```typescript
interface MailerOptions {
  host: string; // SMTP host
  port: number; // SMTP port
  user: string; // SMTP username
  password: string; // SMTP password
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

### RetryOptions

Retry configuration:

```typescript
interface RetryOptions {
  maxRetries?: number; // Maximum retry attempts
  delay?: number; // Delay between retries (ms)
}
```

### RateLimitOptions

Rate limiting configuration:

```typescript
interface RateLimitOptions {
  maxRequests?: number; // Maximum requests per interval
  interval?: number; // Interval period (ms)
}
```

## Error Handling

The package propagates SMTP errors and retry failures. Handle them appropriately:

```typescript
try {
  await mailer.send();
} catch (error) {
  if (error.message.includes('Max retries reached')) {
    // Handle retry failure
  } else {
    // Handle other errors
  }
}
```

## TypeScript Support

The package is written in TypeScript and provides full type definitions. Use generic type parameter for template data:

```typescript
interface UserData {
  name: string;
  email: string;
}

const mailer = new Mailer<UserData>({
  // ... config
});

mailer.setData({
  name: 'John', // TypeScript will check this
  email: 'john@example.com',
});
```
