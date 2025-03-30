export class StringValue {
  constructor(private readonly value: string = '') {}

  getValue(): string {
    return this.value;
  }

  isEmpty(): boolean {
    return this.value.length === 0;
  }

  equals(other: StringValue | string): boolean {
    if (typeof other === 'string') {
      return this.value === other;
    }
    return this.value === other.getValue();
  }

  public static create(value: string = ''): StringValue {
    return new StringValue(value);
  }
}
