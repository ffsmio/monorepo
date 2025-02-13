import { RateLimiter } from './rate-limiter';
import { Formatter } from './formatter';
import { Retry } from './retry';
import {
  Attachment,
  Components,
  MailDriver,
  MailerAddress,
  MailerFrom,
  MailerOptions,
  MailerStatic,
  ObjectOf,
  RateLimitOptions,
  RetryOptions,
  SendOptions,
  Transporter,
} from './types';

export class Mailer<T = unknown> {
  private readonly transporter: Transporter;

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

  private to: MailerAddress | undefined;

  constructor(
    private readonly driver: MailDriver,
    private options: MailerOptions & Omit<SendOptions, 'html'>
  ) {
    this.formatter = new Formatter<T>(options.content || '');
    this.subject = new Formatter<T>(options.subject || '');
    this.transporter = this.createTransporter();
    this.extractOptions(options);
  }

  private extractOptions(options: SendOptions) {
    this.headers = options.headers || {};
    this.replyTo = options.replyTo || options.from;
    this.attachments = options.attachments || [];
    this.cc = options.cc;
    this.bcc = options.bcc;
    this.from = options.from;
    this.to = options.to;
  }

  private createTransporter() {
    return this.driver.createTransport({
      host: this.options.host,
      port: this.options.port,
      secure: false,
      auth: this.options.auth,
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

  setSender(options: SendOptions) {
    this.extractOptions(options);

    if (options.subject) {
      this.subject.setContent(options.subject);
    }

    return this;
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
    console.log({
      from: this.from,
      to: this.to,
      subject: this.getSubject(),
      html: this.getContent(),
      attachments,
      replyTo: this.replyTo,
      cc: this.cc,
      bcc: this.bcc,
    });

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
    const mailer = new Mailer<T>(config.driver, config.options);
    mailer
      .setComponents(config.components ?? {})
      .setData(config.data ?? {})
      .extractOptions(config.options);

    config.retry && mailer.setRetry(config.retry);
    config.rateLimit && mailer.setRateLimit(config.rateLimit);

    return mailer;
  }
}
