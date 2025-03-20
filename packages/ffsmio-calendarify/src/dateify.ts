import Nullish from '@ffsm/nullish';

export class Dateify {
  static current() {
    return new Date();
  }

  static getUTC(date?: Date) {
    date = Nullish.nullish(date, this.current());
    return date.getTime() + date.getTimezoneOffset() * 60000;
  }

  static locale(timezone: number = 0, date?: Date) {
    const utc = this.getUTC(date);
    return new Date(utc + 3600000 * timezone);
  }

  static getCurrentMonth(timezone?: number): number {
    return Nullish.isNullish(timezone)
      ? this.current().getMonth() + 1
      : this.locale(timezone).getMonth() + 1;
  }

  static getCurrentYear(timezone?: number): number {
    return Nullish.isNullish(timezone)
      ? this.current().getFullYear()
      : this.locale(timezone).getFullYear();
  }

  static getCurrentDay(timezone?: number): number {
    return Nullish.isNullish(timezone)
      ? this.current().getDate()
      : this.locale(timezone).getDate();
  }

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

  static getDaysInMonth(...[year, month]: [number, number] | never): number {
    return Nullish.isNullish(month)
      ? new Date(this.getCurrentYear(), this.getCurrentMonth(), 0).getDate()
      : new Date(year, month, 0).getDate();
  }

  static getDayOfWeek(
    ...[year, month, day]: [number, number, number] | never
  ): number {
    return Nullish.isNullish(day)
      ? this.current().getDay()
      : new Date(year, month - 1, day).getDay();
  }

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

  static add(date: Date, days: number) {
    const newDate = this.from(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  static isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }
}
