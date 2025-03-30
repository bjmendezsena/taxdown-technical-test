import {
  v4 as uuidv4,
  validate as uuidValidate,
  version as uuidVersion,
} from 'uuid';

export class UUID {
  constructor(private readonly id: string) {}

  static create(id?: string): UUID {
    return new UUID(id ?? uuidv4());
  }
  static createFromList(ids: string[]): UUID[] {
    return ids.map((id) => new UUID(id));
  }

  static isValid(id: string): boolean {
    return uuidValidate(id) && uuidVersion(id) === 4;
  }

  static createList(ids: string[]) {
    return ids.map((id) => UUID.create(id));
  }

  equals(other: UUID | string): boolean {
    if (typeof other === 'string') {
      other = new UUID(other);
    }
    return this.id === other.id;
  }

  getValue(): string {
    return this.id;
  }
  public isEmpty(): boolean {
    return this.id === '';
  }
}
