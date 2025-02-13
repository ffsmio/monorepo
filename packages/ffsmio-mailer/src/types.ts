import { Readable } from 'stream';
import { Url } from 'url';

type Headers =
  | { [key: string]: string | string[] | { prepared: boolean; value: string } }
  | Array<{ key: string; value: string }>;

export interface SendOptions {
  to?: MailerAddress;
  from?: MailerFrom;
  subject?: string;
  cc?: MailerAddress;
  bcc?: MailerAddress;
  replyTo?: MailerAddress;
  attachments?: Array<string | Attachment>;
  headers?: ObjectOf<string>;
  html?: string;
}

export interface TransporterMailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

export interface Transporter {
  sendMail(mail: SendOptions): Promise<unknown>;
  verify(): Promise<any>;
}

interface TransportOptions {
  host?: string;
  port?: number;
  auth?: any;
  secure?: boolean;
  url?: string;
}

export interface MailDriver {
  createTransport(options: TransportOptions): Transporter;
}

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

export interface Attachment {
  filename?: string | false;
  cid?: string;
  encoding?: string;
  contentType?: string;
  contentTransferEncoding?: '7bit' | 'base64' | 'quoted-printable' | false;
  contentDisposition?: 'attachment' | 'inline';
  headers?: Headers;
  content?: string | Buffer | Readable;
  path?: string | Url;
  raw?:
    | string
    | Buffer
    | Readable
    | {
        content?: string | Buffer | Readable | undefined;
        path?: string | Url | undefined;
      };
}

export interface MailAddress {
  name: string;
  address: string;
}

export type MailerFrom = string | MailAddress;

export type MailerAddress = MailerFrom | Array<MailerFrom>;

export interface MailerOptions extends TransportOptions {
  content?: string;
  subject?: string;
}

export interface MailerStatic<T = unknown> {
  driver: MailDriver;
  options: MailerOptions & Omit<SendOptions, 'html'>;
  components?: Components;
  data?: ObjectOf<T>;
  retry?: RetryOptions;
  rateLimit?: RateLimitOptions;
}
