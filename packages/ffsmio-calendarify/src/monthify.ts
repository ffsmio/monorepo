import Nullish from '@ffsm/nullish';
import { Dateify } from './dateify';
import { Dayify } from './dayify';

/**
 * Options for configuring a Monthify instance.
 */
export interface MonthifyOptions {
  /** The year to use. Defaults to current year. */
  year?: number;

  /** The month to use (1-12). Defaults to current month. */
  month?: number;

  /** The day to use. Defaults to current day. */
  day?: number;

  /** The locale to use for formatting. */
  locale?: string;

  /** Whether to include days from adjacent months to fill weeks. Defaults to true. */
  includeAdjacentMonths?: boolean;

  /** The timezone offset in hours. */
  timezone?: number;
}

/**
 * Options for moving to next or previous month.
 *
 * Excludes year, month, and day from MonthifyOptions.
 */
type MonthNextPrevOptions = Omit<MonthifyOptions, 'year' | 'month' | 'day'>;

/**
 * A class for working with calendar months and generating calendar displays.
 *
 * Provides tools for navigating between months and generating day arrays for each month.
 */
export class Monthify<
  Options extends MonthifyOptions = MonthifyOptions,
> extends Dateify {
  /** Days from the previous month to display at the start of a calendar view. */
  private daysOfPrevMonth: Dayify[] = [];
  /** Days of the current month. */
  private daysOfCurrentMonth: Dayify[] = [];
  /** Days from the next month to display at the end of a calendar view. */
  private daysOfNextMonth: Dayify[] = [];

  /** The year of this month. */
  private year: number;
  /** The month (1-12). */
  private month: number;
  /** The reference day of the month. */
  private day: number;

  /**
   * The day of the week for the first day of the month (0-6, where 0 is Sunday).
   */
  private firstDayOfWeek: number;
  /**
   * The day of the week for the last day of the month (0-6, where 0 is Sunday).
   */
  private lastDayOfWeek: number;
  /** The number of days in this month. */
  private daysInMonth: number;
  /** The Date object for the first day of this month. */
  private firstDayOfMonth: Date;

  /** The locale to use for formatting. */
  private readonly locale?: string;
  /** The timezone offset in hours. */
  private readonly timezone?: number;
  /** Whether to include days from adjacent months to fill weeks. */
  private readonly includeAdjacentMonths: boolean;

  /**
   * Creates a new Monthify instance.
   * @param {MonthifyOptions} [options={}] - Configuration options for the month.
   */
  constructor(options: Options = {} as Options) {
    super();

    this.timezone = options.timezone;
    this.locale = options.locale;
    this.includeAdjacentMonths = Nullish.nullish(
      options.includeAdjacentMonths,
      true
    );

    this.year = Nullish.nullish(
      options.year,
      Dateify.getCurrentYear(this.timezone)
    );
    this.month = Nullish.nullish(
      options.month,
      Dateify.getCurrentMonth(this.timezone)
    );
    this.day = Nullish.nullish(
      options.day,
      Dateify.getCurrentDay(this.timezone)
    );

    this.adjust().generateCalendar().generatePrev().generateNext();
  }

  /**
   * Adjusts the month's properties to ensure valid dates and calculates key values.
   * @private
   * @returns {Monthify} This instance for method chaining.
   */
  private adjust() {
    const adjusted = Dateify.from(this.year, this.month, this.day);
    const located = Dateify.locale(this.timezone, adjusted);

    this.year = located.getFullYear();
    this.month = located.getMonth() + 1;
    this.day = located.getDate();

    this.daysInMonth = Dateify.getDaysInMonth(this.year, this.month);
    this.firstDayOfMonth = Dateify.from(this.year, this.month);
    this.firstDayOfWeek = this.firstDayOfMonth.getDay();
    this.lastDayOfWeek = Dateify.from(
      this.year,
      this.month,
      this.daysInMonth
    ).getDay();

    return this;
  }

  /**
   * Generates days from the previous month to fill the start of the calendar.
   * @private
   * @returns {Monthify} This instance for method chaining.
   */
  private generatePrev() {
    if (!this.includeAdjacentMonths || this.firstDayOfWeek < 1) {
      return this;
    }

    const prev = this.prev({ includeAdjacentMonths: false }).getDays();
    this.daysOfPrevMonth = prev.slice(prev.length - this.firstDayOfWeek);

    return this;
  }

  /**
   * Generates days from the next month to fill the end of the calendar.
   * @private
   * @returns {Monthify} This instance for method chaining.
   */
  private generateNext() {
    if (!this.includeAdjacentMonths || this.lastDayOfWeek === 6) {
      return this;
    }

    const next = this.next({ includeAdjacentMonths: false }).getDays();
    this.daysOfNextMonth = next.slice(0, 6 - this.lastDayOfWeek);

    return this;
  }

  /**
   * Generates Dayify objects for all days in the current month.
   * @private
   * @returns {Monthify} This instance for method chaining.
   */
  private generateCalendar() {
    for (let day = 1; day <= this.daysInMonth; ++day) {
      this.daysOfCurrentMonth.push(
        new Dayify(this.timezone, day, this.month, this.year)
      );
    }
    return this;
  }

  /**
   * Gets a Monthify instance for the next month.
   * @param {MonthNextPrevOptions} [options={}] - Options to apply to the new instance.
   * @returns {Monthify} A new Monthify instance for the next month.
   */
  next(options: MonthNextPrevOptions = {}) {
    let year = this.year;
    let month = this.month + 1;

    if (this.month === 12) {
      month = 1;
      year += 1;
    }

    return this.clone(month, year, options);
  }

  /**
   * Gets a Monthify instance for the previous month.
   * @param {MonthNextPrevOptions} [options={}] - Options to apply to the new instance.
   * @returns {Monthify} A new Monthify instance for the previous month.
   */
  prev(options: MonthNextPrevOptions = {}) {
    let year = this.year;
    let month = this.month - 1;

    if (this.month === 1) {
      month = 12;
      year -= 1;
    }

    return this.clone(month, year, options);
  }

  /**
   * Adds a specified number of months to this month.
   * @param {number} months - The number of months to add (can be negative).
   * @param {MonthifyOptions} [options] - Options to apply to the new instance.
   * @returns {Monthify} A new Monthify instance for the calculated month.
   */
  add(months: number, options?: MonthifyOptions) {
    return this.clone(this.month + months, this.year, options);
  }

  /**
   * Creates a clone of this instance with optionally modified properties.
   * @param {number} [month] - The month to use (1-12). Defaults to this instance's month.
   * @param {number} [year] - The year to use. Defaults to this instance's year.
   * @param {MonthifyOptions} [options={}] - Additional options to apply to the new instance.
   * @returns {Monthify} A new Monthify instance with the specified properties.
   */
  clone(month?: number, year?: number, options: MonthifyOptions = {}) {
    year ??= this.year;
    month ??= this.month;

    return new Monthify({
      month,
      year,
      day: Nullish.nullish(options.day, this.day),
      locale: Nullish.nullish(options.locale, this.locale),
      includeAdjacentMonths: Nullish.nullish(
        options.includeAdjacentMonths,
        this.includeAdjacentMonths
      ),
      timezone: Nullish.nullish(options.timezone, this.timezone),
    });
  }

  /**
   * Checks if the current year is a leap year.
   * @returns {boolean} True if the year is a leap year, false otherwise.
   */
  isLeapYear() {
    return Dateify.isLeapYear(this.year);
  }

  /**
   * Gets an array of Dayify objects for all days in the current month.
   * @returns {Dayify[]} Array of Dayify objects for the days of the current month.
   */
  getDays() {
    return this.daysOfCurrentMonth;
  }

  /**
   * Gets an array of Dayify objects for days from the previous month that appear
   * in the calendar view to fill the first week.
   * @returns {Dayify[]} Array of Dayify objects for days from the previous month.
   */
  getPrevDays() {
    return this.daysOfPrevMonth;
  }

  /**
   * Gets an array of Dayify objects for days from the next month that appear
   * in the calendar view to fill the last week.
   * @returns {Dayify[]} Array of Dayify objects for days from the next month.
   */
  getNextDays() {
    return this.daysOfNextMonth;
  }

  /**
   * Generates a calendar representation of the month with complete weeks.
   * @param {boolean} [addAdjacent] - Override the instance's includeAdjacentMonths setting.
   * If true, adjacent month days will be included regardless of the instance setting.
   * If undefined, the instance's includeAdjacentMonths setting will be used.
   * @returns {Object} An object containing:
   *   - weeks: Array of arrays, each representing a week with 7 days (Dayify objects or null)
   *   - flatten: A flat array of all days (including adjacent month days if applicable)
   *   - numberOfWeeks: The number of weeks in the calendar view
   *   - numberOfDays: The total number of days in the calendar view
   */
  getCalendar<T extends boolean>(addAdjacent?: T) {
    const days = this.getDays();
    const isAdjacent = addAdjacent || this.includeAdjacentMonths;
    let $month: Monthify = this;

    if (!this.includeAdjacentMonths && addAdjacent) {
      $month = this.clone(this.month, this.year, {
        includeAdjacentMonths: true,
      });
    }

    const prev = isAdjacent
      ? $month.getPrevDays()
      : Array(this.firstDayOfWeek).fill(null);
    const next = isAdjacent
      ? $month.getNextDays()
      : Array(7 - this.lastDayOfWeek).fill(null);

    type ArrayDayify = T extends true
      ? Dateify[]
      : Options['includeAdjacentMonths'] extends true
        ? Dateify[]
        : Array<Dayify | null>;

    const flatten = [...prev, ...days, ...next] as ArrayDayify;
    const numberOfDays = flatten.length;
    const numberOfWeeks = Math.ceil(numberOfDays / 7);
    const weeks: ArrayDayify[] = [];

    for (let i = 0; i < numberOfWeeks; i++) {
      weeks.push(flatten.slice(i * 7, i * 7 + 7) as ArrayDayify);
    }

    return {
      weeks,
      flatten,
      numberOfWeeks,
      numberOfDays,
    };
  }

  /**
   * Gets the month number (1-12) of this Monthify instance.
   * @returns {number} The month number (1-12).
   */
  getMonth() {
    return this.month;
  }

  /**
   * Gets the year of this Monthify instance.
   * @returns {number} The year.
   */
  getYear() {
    return this.year;
  }

  /**
   * Checks if this month is equal to another Monthify instance.
   * Two months are considered equal if they have the same year and month.
   * @param {Monthify} other - The Monthify instance to compare with.
   * @returns {boolean} True if the months are equal, false otherwise.
   */
  eq(other: Monthify) {
    return this.year === other.getYear() && this.month === other.getMonth();
  }

  /**
   * Checks if this month equals a specified month and optionally a year.
   * @param {number} month - The month number (1-12) to compare with.
   * @param {number} [year] - The year to compare with. If not provided, only the month is compared.
   * @returns {boolean} True if this month matches the specified criteria, false otherwise.
   */
  eqBy(month: number, year?: number) {
    if (Nullish.isNullish(year)) {
      return this.month === month;
    }

    return this.year === year && this.month === month;
  }
}
