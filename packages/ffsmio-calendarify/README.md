# Headless calendar handle

## Installation

```bash
npm i @ffsm/calendarify
```

OR

```bash
yarn add @ffsm/calendarify
```

## Usage

A utility library for date manipulation and calculations. Provides a clean API for working with dates, timezones, and date components.

The library consists of four main classes:

- `Dateify` - A static utility class for date operations
- `Dayify` - An object-oriented extension that provides instance-based date manipulation
- `Monthify` - A calendar-oriented class for working with entire months and generating calendar views
- `Yearify` - A year-based class for working with entire years and accessing all months

### Dateify

#### current()

Returns the current date.

```typescript
// Get the current date
const now = Dateify.current();
console.log(now); // Current date: 2025-03-21T...
```

#### getUTC(date?)

Converts a date to UTC timestamp in milliseconds.

```typescript
// Get UTC timestamp for current date
const utcNow = Dateify.getUTC();
console.log(utcNow); // UTC timestamp in milliseconds

// Get UTC timestamp for a specific date
const utcSpecific = Dateify.getUTC(new Date('2025-01-01'));
console.log(utcSpecific); // UTC timestamp for January 1, 2025
```

#### locale(timezone?, date?)

Converts a date to a specific timezone.

```typescript
// Get date in UTC+7 timezone
const bangkokTime = Dateify.locale(7);
console.log(bangkokTime);

// Get a specific date in UTC-5 timezone
const nyTime = Dateify.locale(-5, new Date('2025-01-01T12:00:00Z'));
console.log(nyTime);
```

#### getCurrentMonth(timezone?)

Gets the current month (1-12) for a specific timezone.

```typescript
// Get current month in local timezone
const localMonth = Dateify.getCurrentMonth();
console.log(localMonth); // 1-12

// Get current month in UTC+8 timezone
const beijingMonth = Dateify.getCurrentMonth(8);
console.log(beijingMonth); // 1-12
```

#### getCurrentYear(timezone?)

Gets the current year for a specific timezone.

```typescript
// Get current year in local timezone
const localYear = Dateify.getCurrentYear();
console.log(localYear); // e.g., 2025

// Get current year in UTC-3 timezone
const saoPauloYear = Dateify.getCurrentYear(-3);
console.log(saoPauloYear);
```

#### getCurrentDay(timezone?)

Gets the current day of the month for a specific timezone.

```typescript
// Get current day in local timezone
const localDay = Dateify.getCurrentDay();
console.log(localDay); // 1-31

// Get current day in UTC+1 timezone
const parisDay = Dateify.getCurrentDay(1);
console.log(parisDay);
```

#### isToday(year, month, day, timezone?)

Checks if a specific date is today in a given timezone.

```typescript
// Check if 2025-03-21 is today in local timezone
const isToday = Dateify.isToday(2025, 3, 21);
console.log(isToday); // true/false

// Check if 2025-03-22 is today in UTC+9 timezone
const isTodayInTokyo = Dateify.isToday(2025, 3, 22, 9);
console.log(isTodayInTokyo); // true/false
```

#### getDaysInMonth(year, month)

Gets the number of days in a specific month.

```typescript
// Get days in February 2024 (leap year)
const febDays2024 = Dateify.getDaysInMonth(2024, 2);
console.log(febDays2024); // 29

// Get days in February 2025 (non-leap year)
const febDays2025 = Dateify.getDaysInMonth(2025, 2);
console.log(febDays2025); // 28

// Get days in current month
const daysInCurrentMonth = Dateify.getDaysInMonth();
console.log(daysInCurrentMonth);
```

#### getDayOfWeek(year, month, day)

Gets the day of the week for a specific date.

```typescript
// Get day of week for 2025-01-01
const newYearDayOfWeek = Dateify.getDayOfWeek(2025, 1, 1);
console.log(newYearDayOfWeek); // 0-6 (0 is Sunday)

// Get day of week for today
const todayDayOfWeek = Dateify.getDayOfWeek();
console.log(todayDayOfWeek);
```

#### from(...params)

Creates a new Date object from various input formats.

```typescript
// Create from year, month, day (note: month is 1-based)
const date1 = Dateify.from(2025, 3, 21);
console.log(date1);

// Create from full date components
const date2 = Dateify.from(2025, 3, 21, 15, 30, 0, 0);
console.log(date2);

// Create from string
const date3 = Dateify.from('2025-03-21T15:30:00');
console.log(date3);

// Create from another Date object
const date4 = Dateify.from(new Date());
console.log(date4);

// Create with no parameters (returns current date)
const date5 = Dateify.from();
console.log(date5);
```

#### add(date, days)

Adds a specified number of days to a date.

```typescript
// Add 5 days to a date
const futureDate = Dateify.add(new Date('2025-03-21'), 5);
console.log(futureDate); // 2025-03-26

// Subtract 10 days from a date
const pastDate = Dateify.add(new Date('2025-03-21'), -10);
console.log(pastDate); // 2025-03-11
```

#### isLeapYear(year)

Checks if a year is a leap year.

```typescript
// Check if 2024 is a leap year
const isLeap2024 = Dateify.isLeapYear(2024);
console.log(isLeap2024); // true

// Check if 2025 is a leap year
const isLeap2025 = Dateify.isLeapYear(2025);
console.log(isLeap2025); // false
```

### Dayify

Dayify is an object-oriented extension of Dateify that provides instance-based date manipulation with timezone support.

#### constructor(timezone?, day?, month?, year?)

Creates a new Dayify instance.

```typescript
// Current date in local timezone
const today = new Dayify();

// Current date in UTC+7 timezone
const bangkokToday = new Dayify(7);

// Specific date: March 21, 2025 in local timezone
const specificDay = new Dayify(undefined, 21, 3, 2025);

// Specific date: December 25, 2025 in UTC-5 timezone
const christmasInNY = new Dayify(-5, 25, 12, 2025);
```

#### getDay()

Gets the day of the month.

```typescript
const day = new Dayify();
console.log(day.getDay()); // Current day, e.g., 21
```

#### getMonth()

Gets the month (1-12).

```typescript
const day = new Dayify();
console.log(day.getMonth()); // Current month, e.g., 3
```

#### getYear()

Gets the year.

```typescript
const day = new Dayify();
console.log(day.getYear()); // Current year, e.g., 2025
```

#### getDate()

Gets the JavaScript Date object representing this instance.

```typescript
const day = new Dayify();
const jsDate = day.getDate();
console.log(jsDate); // Date object
```

#### getTimezone()

Gets the timezone offset in hours.

```typescript
const day = new Dayify(7);
console.log(day.getTimezone()); // 7
```

#### getDayOfWeek()

Gets the day of the week (0-6, where 0 is Sunday).

```typescript
const day = new Dayify();
console.log(day.getDayOfWeek()); // Day of week, e.g., 5 (Friday)

const christmas2025 = new Dayify(undefined, 25, 12, 2025);
console.log(christmas2025.getDayOfWeek()); // 4 (Thursday)
```

#### isToday()

Checks if this date is today.

```typescript
const today = new Dayify();
console.log(today.isToday()); // true

const tomorrow = new Dayify(undefined, 22, 3, 2025); // Assuming today is March 21, 2025
console.log(tomorrow.isToday()); // false
```

#### add(days)

Adds a specified number of days to this date.

```typescript
const today = new Dayify();
const nextWeek = today.add(7);
console.log(nextWeek.getDay()); // Today + 7 days

const lastMonth = today.add(-30);
console.log(lastMonth.getMonth()); // Previous month
```

#### next()

Gets the next day.

```typescript
const today = new Dayify();
const tomorrow = today.next();
console.log(tomorrow.getDay()); // Today + 1 day
```

#### prev()

Gets the previous day.

```typescript
const today = new Dayify();
const yesterday = today.prev();
console.log(yesterday.getDay()); // Today - 1 day
```

#### isWeekend()

Checks if this date is a weekend day (Saturday or Sunday).

```typescript
const today = new Dayify();
console.log(today.isWeekend()); // true/false depending on the day

// Check specific dates
const saturday = new Dayify(undefined, 22, 3, 2025); // March 22, 2025 is a Saturday
console.log(saturday.isWeekend()); // true
```

#### compareTo(other)

Compares this date with another Dayify instance.

```typescript
const date1 = new Dayify(undefined, 21, 3, 2025); // March 21, 2025
const date2 = new Dayify(undefined, 22, 3, 2025); // March 22, 2025

console.log(date1.compareTo(date2)); // -1 (date1 is earlier)
console.log(date2.compareTo(date1)); // 1 (date2 is later)

const date3 = new Dayify(undefined, 21, 3, 2025); // Same as date1
console.log(date1.compareTo(date3)); // 0 (equal dates)
```

#### lg(other)

Checks if this date is less than (earlier than) another date.

```typescript
const date1 = new Dayify(undefined, 21, 3, 2025);
const date2 = new Dayify(undefined, 22, 3, 2025);

console.log(date1.lg(date2)); // true (date1 is earlier than date2)
console.log(date2.lg(date1)); // false (date2 is not earlier than date1)
```

#### gt(other)

Checks if this date is greater than (later than) another date.

```typescript
const date1 = new Dayify(undefined, 21, 3, 2025);
const date2 = new Dayify(undefined, 22, 3, 2025);

console.log(date1.gt(date2)); // false (date1 is not later than date2)
console.log(date2.gt(date1)); // true (date2 is later than date1)
```

#### eq(other)

Checks if this date is equal to another date.

```typescript
const date1 = new Dayify(undefined, 21, 3, 2025);
const date2 = new Dayify(undefined, 21, 3, 2025);
const date3 = new Dayify(undefined, 22, 3, 2025);

console.log(date1.eq(date2)); // true (same dates)
console.log(date1.eq(date3)); // false (different dates)
```

### Monthify

Monthify is a calendar-oriented class for working with entire months and generating calendar views. It's useful for building calendars, date pickers, and scheduling interfaces.

#### constructor(options)

Creates a new Monthify instance.

```typescript
// Current month in local timezone
const currentMonth = new Monthify();

// Specific month: March 2025 in local timezone
const march2025 = new Monthify({ month: 3, year: 2025 });

// January 2026 in UTC+9 timezone
const jan2026Tokyo = new Monthify({
  month: 1,
  year: 2026,
  timezone: 9,
});

// Specify whether to include adjacent month days in calendar view
const monthWithoutAdjacent = new Monthify({
  includeAdjacentMonths: false,
});

// Specify locale for formatting (affects formatter methods)
const frenchMonth = new Monthify({ locale: 'fr-FR' });
```

#### getDays()

Gets an array of Dayify objects for all days in the current month.

```typescript
const march2025 = new Monthify({ month: 3, year: 2025 });
const marchDays = march2025.getDays();

console.log(marchDays.length); // 31 (March has 31 days)
console.log(marchDays[0].getDay()); // 1 (first day of month)
console.log(marchDays[0].getMonth()); // 3 (March)
```

#### getPrevDays()

Gets days from the previous month that appear in the calendar view.

```typescript
const march2025 = new Monthify({ month: 3, year: 2025 });
const prevDays = march2025.getPrevDays();

// The first day of March 2025 is a Saturday, so there would be days
// from February shown in a calendar view to fill the week
console.log(prevDays.length); // Number of days from February shown
console.log(prevDays[0].getMonth()); // 2 (February)
```

#### getNextDays()

Gets days from the next month that appear in the calendar view.

```typescript
const march2025 = new Monthify({ month: 3, year: 2025 });
const nextDays = march2025.getNextDays();

// The last day of March 2025 is a Monday, so there would be days
// from April shown in a calendar view to fill the week
console.log(nextDays.length); // Number of days from April shown
console.log(nextDays[0].getMonth()); // 4 (April)
```

#### next(options)

Gets a Monthify instance for the next month.

```typescript
const march2025 = new Monthify({ month: 3, year: 2025 });
const april2025 = march2025.next();

console.log(april2025.getDays()[0].getMonth()); // 4 (April)
console.log(april2025.getDays()[0].getYear()); // 2025

// December to January (year change)
const dec2025 = new Monthify({ month: 12, year: 2025 });
const jan2026 = dec2025.next();

console.log(jan2026.getDays()[0].getMonth()); // 1 (January)
console.log(jan2026.getDays()[0].getYear()); // 2026
```

#### prev(options)

Gets a Monthify instance for the previous month.

```typescript
const march2025 = new Monthify({ month: 3, year: 2025 });
const feb2025 = march2025.prev();

console.log(feb2025.getDays()[0].getMonth()); // 2 (February)
console.log(feb2025.getDays()[0].getYear()); // 2025

// January to December (year change)
const jan2025 = new Monthify({ month: 1, year: 2025 });
const dec2024 = jan2025.prev();

console.log(dec2024.getDays()[0].getMonth()); // 12 (December)
console.log(dec2024.getDays()[0].getYear()); // 2024
```

#### add(months, options)

Adds a specified number of months to this month.

```typescript
const march2025 = new Monthify({ month: 3, year: 2025 });

// Add 2 months (March → May)
const may2025 = march2025.add(2);
console.log(may2025.getDays()[0].getMonth()); // 5 (May)
console.log(may2025.getDays()[0].getYear()); // 2025

// Add 12 months (March 2025 → March 2026)
const march2026 = march2025.add(12);
console.log(march2026.getDays()[0].getMonth()); // 3 (March)
console.log(march2026.getDays()[0].getYear()); // 2026

// Subtract 3 months (March → December previous year)
const dec2024 = march2025.add(-3);
console.log(dec2024.getDays()[0].getMonth()); // 12 (December)
console.log(dec2024.getDays()[0].getYear()); // 2024
```

#### clone(month, year, options)

Creates a clone of this instance with optionally modified properties.

```typescript
const march2025 = new Monthify({ month: 3, year: 2025 });

// Clone with the same month and year
const marchClone = march2025.clone();

// Clone with a different month
const june2025 = march2025.clone(6);

// Clone with different month and year
const august2026 = march2025.clone(8, 2026);

// Clone with different options
const september2025WithoutAdjacent = march2025.clone(9, 2025, {
  includeAdjacentMonths: false,
});
```

#### isLeapYear()

Checks if the current year is a leap year.

```typescript
const february2024 = new Monthify({ month: 2, year: 2024 });
console.log(february2024.isLeapYear()); // true (2024 is a leap year)

const february2025 = new Monthify({ month: 2, year: 2025 });
console.log(february2025.isLeapYear()); // false (2025 is not a leap year)
```

#### getCalendar(addAdjacent?)

Generates a complete calendar representation of the month with weeks. This method is essential for building calendar UI components, as it organizes days into a structured grid format.

```typescript
const march2025 = new Monthify({ month: 3, year: 2025 });

// Get calendar using instance's includeAdjacentMonths setting
const calendar = march2025.getCalendar();
console.log(calendar.numberOfWeeks); // Number of weeks in the calendar
console.log(calendar.weeks[0]); // First week of the calendar
```

The returned object contains everything needed to display a calendar:

```typescript
interface CalendarResult {
  // 2D array of days organized in weeks
  weeks: (Dayify | null)[][];
  // Flat array of all days in calendar view
  flatten: (Dayify | null)[];
  // Number of weeks in the calendar
  numberOfWeeks: number;
  // Total number of days in the calendar view
  numberOfDays: number;
}
```

**Override instance settings:**

You can force including adjacent month days regardless of how the Monthify instance was configured:

```typescript
// Create a month without adjacent days
const march2025 = new Monthify({
  month: 3,
  year: 2025,
  includeAdjacentMonths: false,
});

// But get a calendar with adjacent days for this specific view
const calendarWithAdjacent = march2025.getCalendar(true);
console.log(calendarWithAdjacent.weeks[0]); // First week with days from previous month
```

**Rendering examples:**

Render a simple text calendar:

```typescript
calendar.weeks.forEach((week) => {
  console.log(week.map((day) => (day ? day.getDay() : null)).join(' | '));
});
```

Handling null values (days from adjacent months):

```typescript
calendar.weeks.forEach((week) => {
  const weekRow = week
    .map((day) => {
      if (!day) return '   '; // Empty cell for null
      return day.isToday() ? `[${day.getDay()}]` : ` ${day.getDay()} `; // Highlight today
    })
    .join('|');
  console.log(weekRow);
});
```

Building a more complex UI:

```jsx
// In a React component
return (
  <div className="calendar">
    {calendar.weeks.map((week, i) => (
      <div key={i} className="week">
        {week.map((day, j) => (
          <div
            key={j}
            className={`day ${!day ? 'empty' : ''} ${day?.isToday() ? 'today' : ''}`}
          >
            {day?.getDay() || ''}
          </div>
        ))}
      </div>
    ))}
  </div>
);
```

#### getMonth()

Gets the month number (1-12) of this Monthify instance.

```typescript
const march2025 = new Monthify({ month: 3, year: 2025 });
console.log(march2025.getMonth()); // 3
```

#### getYear()

Gets the year of this Monthify instance.

```typescript
const march2025 = new Monthify({ month: 3, year: 2025 });
console.log(march2025.getYear()); // 2025
```

#### eq(other)

Checks if this month is equal to another Monthify instance. Two months are considered equal if they have the same year and month.

```typescript
const march2025A = new Monthify({ month: 3, year: 2025 });
const march2025B = new Monthify({ month: 3, year: 2025 });
const april2025 = new Monthify({ month: 4, year: 2025 });
const march2026 = new Monthify({ month: 3, year: 2026 });

console.log(march2025A.eq(march2025B)); // true - same month and year
console.log(march2025A.eq(april2025)); // false - different month
console.log(march2025A.eq(march2026)); // false - different year
```

#### eqBy(month, year?)

Checks if this month equals a specified month and optionally a year.

```typescript
const march2025 = new Monthify({ month: 3, year: 2025 });

// Compare just the month
console.log(march2025.eqBy(3)); // true - month is 3
console.log(march2025.eqBy(4)); // false - month is not 4

// Compare both month and year
console.log(march2025.eqBy(3, 2025)); // true - month is 3 and year is 2025
console.log(march2025.eqBy(3, 2026)); // false - year doesn't match
console.log(march2025.eqBy(4, 2025)); // false - month doesn't match
```

### Yearify

Yearify is a class for working with entire years, providing access to all months within a year. It's useful for building year views in calendars, date pickers, and annual reports.

#### constructor(year?, timezone?)

Creates a new Yearify instance.

```typescript
// Current year in local timezone
const currentYear = new Yearify();

// Specific year in local timezone
const year2025 = new Yearify(2025);

// Specific year in UTC+7 timezone
const year2025Bangkok = new Yearify(2025, 7);
```

#### getMonths()

Gets all months in this year as an array of Monthify instances.

```typescript
const year2025 = new Yearify(2025);
const months = year2025.getMonths();

console.log(months.length); // 12
console.log(months[0].getDays()[0].getMonth()); // 1 (January)
console.log(months[11].getDays()[0].getMonth()); // 12 (December)

// Access specific month
const march = months[2]; // March (index 2 = 3rd month)
console.log(march.getDays().length); // Number of days in March
```

#### next(timezone?)

Gets a Yearify instance for the next year.

```typescript
const year2025 = new Yearify(2025);
const year2026 = year2025.next();

console.log(year2026.getYear()); // 2026

// With different timezone
const year2026Tokyo = year2025.next(9);
console.log(year2026Tokyo.getTimezone()); // 9
```

#### prev(timezone?)

Gets a Yearify instance for the previous year.

```typescript
const year2025 = new Yearify(2025);
const year2024 = year2025.prev();

console.log(year2024.getYear()); // 2024

// With different timezone
const year2024Paris = year2025.prev(1);
console.log(year2024Paris.getTimezone()); // 1
```

#### isLeapYear()

Checks if this year is a leap year.

```typescript
const year2024 = new Yearify(2024);
console.log(year2024.isLeapYear()); // true (2024 is a leap year)

const year2025 = new Yearify(2025);
console.log(year2025.isLeapYear()); // false (2025 is not a leap year)
```
