import { Callback, RetryOptions } from './types';

export class Retry {
  static DEFAULT_DELAY = 3000;

  constructor(private options: RetryOptions) {}

  setOptions(options: RetryOptions) {
    this.options = options;
    return this;
  }

  async retry<T>(callback: Callback<T>) {
    let lastError: Error | undefined;
    let delay = this.options.delay || Retry.DEFAULT_DELAY;
    const maxRetries = this.options.maxRetries || 1;

    for (let attemp = 1; attemp <= maxRetries; attemp++) {
      try {
        return await callback();
      } catch (error) {
        lastError = error as Error;

        if (attemp === this.options.maxRetries) {
          throw new Error(
            `| Mailer Retry > Max retries reached (${maxRetries}): ${lastError.message}`
          );
        }

        await Retry.sleep(delay);
      }
    }

    throw lastError;
  }

  static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
