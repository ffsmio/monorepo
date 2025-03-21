import Nullish from '@ffsm/nullish';

/**
 * A utility class for date manipulation and calculations.
 * Provides methods for working with dates, timezones, and date components.
 */
export class Dateify {
  /**
   * Returns the current date.
   * @returns {Date} The current date.
   */
  static current() {
    return new Date();
  }

  /**
   * Gets the UTC timestamp for a given date.
   * @param {Date} [date] - The date to convert to UTC. Defaults to current date if not provided.
   * @returns {number} The UTC timestamp in milliseconds.
   */
  static getUTC(date?: Date) {
    date = Nullish.nullish(date, this.current());
    return date.getTime() + date.getTimezoneOffset() * 60000;
  }

  /**
   * Converts a date to a specific timezone.
   * @param {number} [timezone=0] - The timezone offset in hours. Defaults to 0 (UTC).
   * @param {Date} [date] - The date to convert. Defaults to current date if not provided.
   * @returns {Date} The date adjusted to the specified timezone.
   */
  static locale(timezone: number = 0, date?: Date) {
    const utc = this.getUTC(date);
    return new Date(utc + 3600000 * timezone);
  }

  /**
   * Gets the current month number (1-12) for a specific timezone.
   * @param {number} [timezone] - The timezone offset in hours.
   * @returns {number} The current month (1-12).
   */
  static getCurrentMonth(timezone?: number): number {
    return Nullish.isNullish(timezone)
      ? this.current().getMonth() + 1
      : this.locale(timezone).getMonth() + 1;
  }

  /**
   * Gets the current year for a specific timezone.
   * @param {number} [timezone] - The timezone offset in hours.
   * @returns {number} The current year.
   */
  static getCurrentYear(timezone?: number): number {
    return Nullish.isNullish(timezone)
      ? this.current().getFullYear()
      : this.locale(timezone).getFullYear();
  }

  /**
   * Gets the current day of the month for a specific timezone.
   * @param {number} [timezone] - The timezone offset in hours.
   * @returns {number} The current day of the month.
   */
  static getCurrentDay(timezone?: number): number {
    return Nullish.isNullish(timezone)
      ? this.current().getDate()
      : this.locale(timezone).getDate();
  }

  /**
   * Checks if a specific date is today in a given timezone.
   * @param {number} year - The year to check.
   * @param {number} month - The month to check (1-12).
   * @param {number} day - The day to check.
   * @param {number} [timezone] - The timezone offset in hours.
   * @returns {boolean} True if the specified date is today, false otherwise.
   */
  static isToday(
    year: number,
    month: number,
    day: number,
    timezone?: number
  ): boolean {
    return [
      this.getCurrentYear(timezone) === year,
      this.getCurrentMonth(timezone) === month,
      this.getCurrentDay(timezone) === day,
    ].every(Boolean);
  }

  /**
   * Gets the number of days in a specific month.
   * @param {number} year - The year.
   * @param {number} month - The month (1-12).
   * @returns {number} The number of days in the specified month.
   */
  static getDaysInMonth(...[year, month]: [number, number] | never): number {
    return Nullish.isNullish(month)
      ? new Date(this.getCurrentYear(), this.getCurrentMonth(), 0).getDate()
      : new Date(year, month, 0).getDate();
  }

  /**
   * Gets the day of the week for a specific date.
   * @param {number} year - The year.
   * @param {number} month - The month (1-12).
   * @param {number} day - The day.
   * @returns {number} The day of the week (0-6, where 0 is Sunday).
   */
  static getDayOfWeek(
    ...[year, month, day]: [number, number, number] | never
  ): number {
    return Nullish.isNullish(day)
      ? this.current().getDay()
      : new Date(year, month - 1, day).getDay();
  }

  /**
   * Creates a new Date object from various input formats.
   * @param {...(number|string|Date)} params - The date parameters:
   *   - If a single Date object is provided, it returns a copy of that date.
   *   - If a string is provided, it parses the string into a Date.
   *   - If numbers are provided, they are interpreted as [year, month, day, hour, minute, second, millisecond].
   *     Note: Month is 1-based when provided but converted to 0-based for the Date constructor.
   * @returns {Date} A new Date object.
   */
  static from(
    ...params:
      | [number, number?, number?, number?, number?, number?, number?]
      | [string]
      | [Date]
      | never
  ) {
    if (Nullish.isNullishOrEmpty(params)) {
      return this.current();
    }

    if (params.length === 1) {
      return new Date(params[0]);
    }

    if (!Number.isNaN(params[1]) && Number.isFinite(params[1])) {
      params[1]! -= 1;
    }

    params[2] = Nullish.nullish(params[2], 1);
    return new Date(
      ...(params as [number, number, number, number, number, number, number])
    );
  }

  /**
   * Adds a specified number of days to a date.
   * @param {Date} date - The original date.
   * @param {number} days - The number of days to add (can be negative).
   * @returns {Date} A new date with the days added.
   */
  static add(date: Date, days: number) {
    const newDate = this.from(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  /**
   * Checks if a year is a leap year.
   * @param {number} year - The year to check.
   * @returns {boolean} True if the year is a leap year, false otherwise.
   */
  static isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  static DayLabels = [
    ['Sunday', 'S', 'SU', 'Sun'],
    ['Monday', 'M', 'MO', 'Mon'],
    ['Tuesday', 'T', 'TU', 'Tue'],
    ['Wednesday', 'W', 'WE', 'Wed'],
    ['Thursday', 'T', 'TH', 'Thu'],
    ['Friday', 'F', 'FR', 'Fri'],
    ['Saturday', 'S', 'SA', 'Sat'],
  ];

  static getDayLabel(value: number, chars: number = 0) {
    value = value % 7;
    chars = chars % 4;
    return this.DayLabels[value][chars];
  }
}
