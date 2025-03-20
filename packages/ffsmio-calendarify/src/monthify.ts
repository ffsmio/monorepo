import Nullish from '@ffsm/nullish';
import { Dateify } from './dateify';
import { Dayify } from './dayify';

export interface MonthifyOptions {
  year?: number;
  month?: number;
  day?: number;
  locale?: string;
  includeAdjacentMonths?: boolean;
  timezone?: number;
}

type MonthNextPrevOptions = Omit<MonthifyOptions, 'year' | 'month' | 'day'>;

export class Monthify extends Dateify {
  private daysOfPrevMonth: Dayify[] = [];
  private daysOfCurrentMonth: Dayify[] = [];
  private daysOfNextMonth: Dayify[] = [];

  private year: number;
  private month: number;
  private day: number;

  /**
   * 0 - Sun
   */
  private firstDayOfWeek: number;
  private lastDayOfWeek: number;
  private daysInMonth: number;
  private firstDayOfMonth: Date;

  private readonly locale?: string;
  private readonly timezone?: number;
  private readonly includeAdjacentMonths: boolean;

  constructor(options: MonthifyOptions = {}) {
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

  private generatePrev() {
    if (!this.includeAdjacentMonths || this.firstDayOfWeek < 1) {
      return this;
    }

    const prev = this.prev({ includeAdjacentMonths: false }).getDays();
    this.daysOfPrevMonth = prev.slice(prev.length - this.firstDayOfWeek);

    return this;
  }

  private generateNext() {
    if (!this.includeAdjacentMonths || this.lastDayOfWeek === 6) {
      return this;
    }

    const next = this.next({ includeAdjacentMonths: false }).getDays();
    this.daysOfNextMonth = next.slice(0, 6 - this.lastDayOfWeek);

    return this;
  }

  private generateCalendar() {
    for (let day = 1; day <= this.daysInMonth; ++day) {
      this.daysOfCurrentMonth.push(
        new Dayify(this.timezone, day, this.month, this.year)
      );
    }
    return this;
  }

  next(options: MonthNextPrevOptions = {}) {
    let year = this.year;
    let month = this.month + 1;

    if (this.month === 12) {
      month = 1;
      year += 1;
    }

    return this.clone(month, year, options);
  }

  prev(options: MonthNextPrevOptions = {}) {
    let year = this.year;
    let month = this.month - 1;

    if (this.month === 1) {
      month = 12;
      year -= 1;
    }

    return this.clone(month, year, options);
  }

  add(months: number, options?: MonthifyOptions) {
    return this.clone(this.month + months, this.year, options);
  }

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

  isLeapYear() {
    return Dateify.isLeapYear(this.year);
  }

  getDays() {
    return this.daysOfCurrentMonth;
  }

  getPrevDays() {
    return this.daysOfPrevMonth;
  }

  getNextDays() {
    return this.daysOfNextMonth;
  }
}
