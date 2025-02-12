import Mail from 'nodemailer/lib/mailer';

export type { Mail };

export interface RetryOptions {
  maxRetries?: number;
  delay?: number;
}

export interface RateLimitOptions {
  maxRequests?: number;
  interval?: number;
}

export interface Callback<T> {
  (): Promise<T>;
}

export type ObjectOf<T = unknown> = Record<string, T>;

export type Flatterned = ObjectOf<string | number | boolean | null>;

export interface Component {
  content: string;
  data: ObjectOf<unknown>;
}

export type Components = ObjectOf<Component>;

export interface Attachment extends Mail.Attachment {}

export type MailerFrom = string | Mail.Address;

export type MailerAddress = MailerFrom | Array<MailerFrom>;

export interface MailerOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  to: MailerAddress;
  content: string;
  from?: MailerFrom;
  subject?: string;
  cc?: MailerAddress;
  bcc?: MailerAddress;
  replyTo?: MailerAddress;
  attachments?: Array<string | Attachment>;
  headers?: ObjectOf<string>;
}

export interface MailerStatic<T = unknown> {
  options: MailerOptions;
  components?: Components;
  data?: ObjectOf<T>;
  retry?: RetryOptions;
  rateLimit?: RateLimitOptions;
}
