import Nullish from '@ffsm/nullish';
import { Dateify } from './dateify';

/**
 * A day-focused extension of Dateify that provides object-oriented date operations
 * with timezone support and convenient day manipulation methods.
 */
export class Dayify extends Dateify {
  /** The Date object representing this instance */
  private readonly date: Date;

  /** The day of the week (0-6, where 0 is Sunday) */
  private readonly dayOfWeek: number;

  /** Whether this date is today */
  private readonly today: boolean;

  /**
   * Creates a new Dayify instance.
   * @param {number} [timezone] - The timezone offset in hours.
   * @param {number} [day] - The day of the month. Defaults to current day if not provided.
   * @param {number} [month] - The month (1-12). Defaults to current month if not provided.
   * @param {number} [year] - The year. Defaults to current year if not provided.
   */
  constructor(
    private readonly timezone?: number,
    private readonly day?: number,
    private readonly month?: number,
    private readonly year?: number
  ) {
    super();

    this.day = Nullish.nullish(this.day, Dateify.getCurrentDay(this.timezone));
    this.month = Nullish.nullish(
      this.month,
      Dateify.getCurrentMonth(this.timezone)
    );
    this.year = Nullish.nullish(
      this.year,
      Dateify.getCurrentYear(this.timezone)
    );

    this.date = Dateify.from(this.year, this.month, this.day);
    this.today = Dateify.isToday(this.year, this.month, this.day);
    this.dayOfWeek = this.date.getDay();
  }

  /**
   * Gets the day of the month.
   * @returns {number | undefined} The day of the month.
   */
  getDay() {
    return this.day;
  }

  /**
   * Gets the month.
   * @returns {number | undefined} The month (1-12).
   */
  getMonth() {
    return this.month;
  }

  /**
   * Gets the year.
   * @returns {number | undefined} The year.
   */
  getYear() {
    return this.year;
  }

  /**
   * Gets the Date object representing this instance.
   * @returns {Date} The Date object.
   */
  getDate() {
    return this.date;
  }

  /**
   * Gets the timezone offset in hours.
   * @returns {number | undefined} The timezone offset.
   */
  getTimezone() {
    return this.timezone;
  }

  /**
   * Gets the day of the week.
   * @returns {number} The day of the week (0-6, where 0 is Sunday).
   */
  getDayOfWeek() {
    return this.dayOfWeek;
  }

  /**
   * Checks if this date is today.
   * @returns {boolean} True if this date is today, false otherwise.
   */
  isToday() {
    return this.today;
  }

  /**
   * Adds a specified number of days to this date.
   * @param {number} days - The number of days to add (can be negative).
   * @returns {Dayify} A new Dayify instance representing the resulting date.
   */
  add(days: number) {
    const newDate = Dateify.add(this.date, days);

    const newDay = newDate.getDate();
    const newMonth = newDate.getMonth() + 1;
    const newYear = newDate.getFullYear();

    return new Dayify(this.timezone, newDay, newMonth, newYear);
  }

  /**
   * Gets the next day.
   * @returns {Dayify} A new Dayify instance representing the next day.
   */
  next() {
    return this.add(1);
  }

  /**
   * Gets the previous day.
   * @returns {Dayify} A new Dayify instance representing the previous day.
   */
  prev() {
    return this.add(-1);
  }

  /**
   * Checks if this date is a weekend day (Saturday or Sunday).
   * @returns {boolean} True if this date is a weekend, false otherwise.
   */
  isWeekend() {
    return [0, 6].includes(this.dayOfWeek);
  }

  /**
   * Compares this date with another Dayify instance.
   * @param {Dayify} other - The Dayify instance to compare with.
   * @returns {number}
   *   1 if this date is later than the other date,
   *  -1 if this date is earlier than the other date,
   *   0 if the dates are equal.
   */
  compareTo(other: Dayify) {
    const year = other.getYear();

    if (this.year !== year) {
      const minus = this.year! - year!;
      return minus / Math.abs(minus);
    }

    const month = other.getMonth();

    if (this.month !== month) {
      const minus = this.month! - month!;
      return minus / Math.abs(minus);
    }

    const day = other.getDay();

    if (this.day !== day) {
      const minus = this.day! - day!;
      return minus / Math.abs(minus);
    }

    return 0;
  }

  /**
   * Checks if this date is less than (earlier than) another date.
   * @param {Dayify} other - The Dayify instance to compare with.
   * @returns {boolean} True if this date is earlier than the other date, false otherwise.
   */
  lg(other: Dayify) {
    return this.compareTo(other) === -1;
  }

  /**
   * Checks if this date is greater than (later than) another date.
   * @param {Dayify} other - The Dayify instance to compare with.
   * @returns {boolean} True if this date is later than the other date, false otherwise.
   */
  gt(other: Dayify) {
    return this.compareTo(other) === 1;
  }

  /**
   * Checks if this date is equal to another date.
   * @param {Dayify} other - The Dayify instance to compare with.
   * @returns {boolean} True if the dates are equal, false otherwise.
   */
  eq(other: Dayify) {
    return this.compareTo(other) === 0;
  }
}
