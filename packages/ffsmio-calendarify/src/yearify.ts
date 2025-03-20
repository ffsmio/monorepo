import Nullish from '@ffsm/nullish';
import { Dateify } from './dateify';
import { Monthify } from './monthify';

export class Yearify extends Dateify {
  private months: Monthify[] = [];

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

  next(timezone?: number) {
    return new Yearify(this.year! + 1, timezone ?? this.timezone);
  }

  prev(timezone?: number) {
    return new Yearify(this.year! - 1, timezone ?? this.timezone);
  }

  isLeapYear() {
    return Dateify.isLeapYear(this.year!);
  }
}
