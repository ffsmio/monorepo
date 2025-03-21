import Nullish from '@ffsm/nullish';
import { Dateify } from './dateify';
import { Monthify } from './monthify';

/**
 * A class for working with entire years, providing access to all months within a year.
 * Useful for building year views in calendars and date pickers.
 */
export class Yearify extends Dateify {
  /** Array of Monthify instances for all months in the year. */
  private months: Monthify[] = [];

  /**
   * Creates a new Yearify instance.
   * @param {number} [year] - The year to use. Defaults to the current year.
   * @param {number} [timezone] - The timezone offset in hours.
   */
  constructor(
    private readonly year?: number,
    private readonly timezone?: number
  ) {
    super();
    this.year = Nullish.nullish(
      this.year,
      Dateify.getCurrentYear(this.timezone)
    );
    this.generateMonths();
  }

  /**
   * Generates Monthify instances for all 12 months of the year.
   * @private
   */
  private generateMonths() {
    for (let i = 1; i <= 12; i++) {
      this.months.push(
        new Monthify({
          year: this.year,
          month: i,
          includeAdjacentMonths: false,
          timezone: this.timezone,
        })
      );
    }
  }

  /**
   * Gets a Yearify instance for the next year.
   * @param {number} [timezone] - The timezone offset in hours. Defaults to this instance's timezone.
   * @returns {Yearify} A new Yearify instance for the next year.
   */
  next(timezone?: number) {
    return new Yearify(this.year! + 1, timezone ?? this.timezone);
  }

  /**
   * Gets a Yearify instance for the previous year.
   * @param {number} [timezone] - The timezone offset in hours. Defaults to this instance's timezone.
   * @returns {Yearify} A new Yearify instance for the previous year.
   */
  prev(timezone?: number) {
    return new Yearify(this.year! - 1, timezone ?? this.timezone);
  }

  /**
   * Checks if this year is a leap year.
   * @returns {boolean} True if this year is a leap year, false otherwise.
   */
  isLeapYear() {
    return Dateify.isLeapYear(this.year!);
  }
}
