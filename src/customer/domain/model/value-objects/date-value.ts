import * as dateFns from 'date-fns';

export class DateValue {
  constructor(private readonly value: Date = new Date()) {}

  public equals(other: DateValue | Date | string): boolean {
    if (other instanceof DateValue) {
      return this.value.getTime() === other.value.getTime();
    }
    if (other instanceof Date) {
      return this.value.getTime() === other.getTime();
    }
    if (typeof other === 'string') {
      return dateFns.isSameDay(this.value, new Date(other));
    }
    return false;
  }

  public getValue(): Date {
    return this.value;
  }

  public toString(): string {
    return this.value.toISOString();
  }

  public isAfter(date: DateValue): boolean {
    return dateFns.isAfter(this.value, date.value);
  }

  public addDays(days: number): DateValue {
    return new DateValue(dateFns.addDays(this.value, days));
  }

  public isBefore(date: DateValue): boolean {
    return dateFns.isBefore(this.value, date.getValue());
  }

  public format(format: string): string {
    return dateFns.format(this.value, format);
  }
  public static fromString(date: string): DateValue {
    return new DateValue(new Date(date));
  }

  public static now(): DateValue {
    return new DateValue();
  }

  public static create(date: Date): DateValue {
    return new DateValue(date);
  }
}
