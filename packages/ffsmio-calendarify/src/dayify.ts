import Nullish from '@ffsm/nullish';
import { Dateify } from './dateify';

export class Dayify extends Dateify {
  private readonly date: Date;
  private readonly dayOfWeek: number;
  private readonly today: boolean;

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

  getDay() {
    return this.day;
  }

  getMonth() {
    return this.month;
  }

  getYear() {
    return this.year;
  }

  getDate() {
    return this.date;
  }

  getTimezone() {
    return this.timezone;
  }

  getDayOfWeek() {
    return this.dayOfWeek;
  }

  isToday() {
    return this.today;
  }

  add(days: number) {
    const newDate = Dateify.add(this.date, days);

    const newDay = newDate.getDate();
    const newMonth = newDate.getMonth() + 1;
    const newYear = newDate.getFullYear();

    return new Dayify(this.timezone, newDay, newMonth, newYear);
  }

  next() {
    return this.add(1);
  }

  prev() {
    return this.add(-1);
  }

  isWeekend() {
    return [0, 6].includes(this.dayOfWeek);
  }

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

  lg(other: Dayify) {
    return this.compareTo(other) === -1;
  }

  gt(other: Dayify) {
    return this.compareTo(other) === 1;
  }

  eq(other: Dayify) {
    return this.compareTo(other) === 0;
  }
}
