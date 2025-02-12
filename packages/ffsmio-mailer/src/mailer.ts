import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { RateLimiter } from './rate-limiter';
import { Formatter } from './formatter';
import { Retry } from './retry';
import {
  Attachment,
  Components,
  MailerAddress,
  MailerFrom,
  MailerOptions,
  MailerStatic,
  ObjectOf,
  RateLimitOptions,
  RetryOptions,
} from './types';

export type { SMTPTransport };
export { nodemailer };

export class Mailer<T = unknown> {
  private readonly transporter: nodemailer.Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  private readonly formatter: Formatter<T>;

  private readonly subject: Formatter<T>;

  private retry: Retry;

  private rateLimiter: RateLimiter;

  private headers: ObjectOf<string> = {};

  private replyTo: MailerAddress | undefined;

  private attachments: Array<string | Attachment> = [];

  private cc: MailerAddress | undefined;

  private bcc: MailerAddress | undefined;

  private from: MailerFrom | undefined;

  private to: MailerAddress;

  constructor(private options: MailerOptions) {
    this.formatter = new Formatter<T>(options.content);
    this.subject = new Formatter<T>(options.subject || '');
    this.transporter = this.createTransporter();
    this.extractOptions();
  }

  private extractOptions() {
    this.headers = this.options.headers || {};
    this.replyTo = this.options.replyTo || this.options.from;
    this.attachments = this.options.attachments || [];
    this.cc = this.options.cc;
    this.bcc = this.options.bcc;
    this.from = this.options.from;
    this.to = this.options.to;
  }

  private createTransporter() {
    return nodemailer.createTransport({
      host: this.options.host,
      port: this.options.port,
      secure: false,
      auth: {
        user: this.options.user,
        pass: this.options.password,
      },
    });
  }

  private async getAttachments() {
    if (!this.attachments) {
      return;
    }

    return this.attachments.map<Attachment>((attachment) => {
      if (typeof attachment === 'object' && 'protocol' in attachment) {
        return {
          ...attachment,
          headers: {
            ...this.headers,
            ...attachment.headers,
          },
        };
      }

      return {
        headers: {
          ...this.headers,
        },
        raw: {
          path: attachment as string,
        },
      };
    });
  }

  setComponents(components: Components) {
    this.formatter.setComponents(components);
    return this;
  }

  setData(data: ObjectOf<T>) {
    this.formatter.setData(data);
    this.subject.setData(data);
    return this;
  }

  setHeaders(headers: ObjectOf<string>) {
    this.headers = headers;
    return this;
  }

  setReplyTo(replyTo: MailerAddress) {
    this.replyTo = replyTo;
    return this;
  }

  setCc(cc: MailerAddress) {
    this.cc = cc;
    return this;
  }

  setBcc(bcc: MailerAddress) {
    this.bcc = bcc;
    return this;
  }

  setFrom(from: MailerFrom) {
    this.from = from;
    return this;
  }

  setTo(to: MailerAddress) {
    this.to = to;
    return this;
  }

  setRetry(options: RetryOptions) {
    if (!this.retry) {
      this.retry = new Retry(options);
    } else {
      this.retry.setOptions(options);
    }

    return this;
  }

  setRateLimit(options: RateLimitOptions) {
    if (!this.rateLimiter) {
      this.rateLimiter = new RateLimiter(options);
    } else {
      this.rateLimiter.setOptions(options);
    }

    return this;
  }

  getContent() {
    return this.formatter.format();
  }

  getSubject() {
    return this.subject.format();
  }

  private async sendMail() {
    const attachments = await this.getAttachments();

    const sendMail = () =>
      this.transporter.sendMail({
        from: this.from,
        to: this.to,
        subject: this.getSubject(),
        html: this.getContent(),
        attachments,
        replyTo: this.replyTo,
        cc: this.cc,
        bcc: this.bcc,
      });

    if (this.retry) {
      return this.retry.retry(sendMail);
    }

    return sendMail();
  }

  async send() {
    const sendMail = () => this.sendMail();

    if (this.rateLimiter) {
      return this.rateLimiter.handle(sendMail);
    }

    return this.sendMail();
  }

  async verify() {
    try {
      await this.transporter.verify();
      return true;
    } catch {}

    return false;
  }

  getTransporter() {
    return this.transporter;
  }

  static from<T = unknown>(config: MailerStatic<T>) {
    const mailer = new Mailer<T>(config.options);
    mailer.setComponents(config.components ?? {}).setData(config.data ?? {});

    config.retry && mailer.setRetry(config.retry);
    config.rateLimit && mailer.setRateLimit(config.rateLimit);

    return mailer;
  }
}
