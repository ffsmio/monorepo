import { Retry } from './retry';
import { Callback, RateLimitOptions } from './types';

export class RateLimiter {
  static DEFAULT_DELAY = 3000;

  static DEFAULT_MAX_REQUESTS = 1;

  private queues: Array<Callback<unknown>> = [];

  private requestTimes: number[] = [];

  private executing = false;

  constructor(private options: RateLimitOptions) {}

  private async waitForSlot() {
    const now = Date.now();
    const interval = this.options.interval || RateLimiter.DEFAULT_DELAY;
    const maxRequests =
      this.options.maxRequests || RateLimiter.DEFAULT_MAX_REQUESTS;

    this.requestTimes = this.requestTimes.filter(
      (time) => time > now - interval
    );

    if (this.requestTimes.length >= maxRequests) {
      const oldRequestTime = this.requestTimes[0];
      const delay = oldRequestTime + interval - now;
      await Retry.sleep(delay);
    }

    this.requestTimes.push(now);
  }

  private async queue() {
    if (this.executing) {
      return;
    }

    this.executing = true;

    while (this.queues.length) {
      const callback = this.queues.shift()!;
      callback && (await callback());
    }

    this.executing = false;
  }

  setOptions(options: RateLimitOptions) {
    this.options = options;
    return this;
  }

  async handle<T>(callback: Callback<T>) {
    return new Promise((resolve, reject) => {
      this.queues.push(async () => {
        try {
          await this.waitForSlot();
          const result = await callback();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.queue();
    });
  }
}
