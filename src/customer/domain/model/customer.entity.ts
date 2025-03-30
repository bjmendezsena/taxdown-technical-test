import {
  Phone,
  Email,
  Credit,
  DateValue,
  StringValue,
  UUID,
  CustomerCreatedEvent,
  UpdateCustomerEvent,
  CreditNonZeroException,
  CreditAddedEvent,
  DeleteCustomerEvent,
} from '@/customer/domain';
import { DomainEvent } from '@/shared/domain';

type CreateArgs = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  credit?: number;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type UpdateArgs = {
  firstName: string;
  lastName: string;
  email: string;
  credit?: number;
  phone?: string;
};

type CustomerObject = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  credit?: number;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Customer {
  private readonly events: DomainEvent[] = [];
  private constructor(
    public readonly id: UUID,
    public firstName: StringValue,
    public lastName: StringValue,
    public email: Email,
    public credit: Credit,
    public phone?: Phone,
    public createdAt?: DateValue,
    public updatedAt?: DateValue,
  ) {}

  static create({
    email,
    firstName,
    id,
    lastName,
    phone,
    credit = 0,
    createdAt,
    updatedAt,
  }: CreateArgs): Customer {
    const customer = new Customer(
      UUID.create(id),
      StringValue.create(firstName),
      StringValue.create(lastName),
      new Email(email),
      new Credit(credit),
      phone ? new Phone(phone) : null,
      DateValue.create(createdAt),
      DateValue.create(updatedAt),
    );

    customer.record(
      new CustomerCreatedEvent(id, firstName, lastName, email, phone ?? null),
    );

    return customer;
  }

  static reconstitute({
    email,
    firstName,
    id,
    lastName,
    phone,
    credit = 0,
    createdAt,
    updatedAt,
  }: CreateArgs): Customer {
    const customer = new Customer(
      UUID.create(id),
      StringValue.create(firstName),
      StringValue.create(lastName),
      new Email(email),
      new Credit(credit),
      phone ? new Phone(phone) : null,
      DateValue.create(createdAt),
      DateValue.create(updatedAt),
    );

    customer.credit.toCreditUnit();

    return customer;
  }

  public update({
    firstName,
    lastName,
    email,
    phone,
    credit,
  }: UpdateArgs): Customer {
    const newCustomer = new Customer(
      this.id,
      StringValue.create(firstName),
      StringValue.create(lastName),
      new Email(email),
      new Credit(credit),
      phone ? new Phone(phone) : null,
      this.createdAt,
      this.updatedAt,
    );

    newCustomer.record(
      new UpdateCustomerEvent(
        this.id.getValue(),
        firstName,
        lastName,
        email,
        phone ?? null,
      ),
    );

    return newCustomer;
  }

  public getFullName(): string {
    return `${this.firstName.getValue()} ${this.lastName.getValue()}`;
  }

  public getEmail(): string {
    return this.email.getValue();
  }

  public getPhone(): string | null {
    return this.phone?.getValue() ?? null;
  }

  public getAvailableCredit(): number {
    return this.credit.getValue();
  }

  public validateCredit(): void {
    if (!this.credit.isPositive()) {
      throw new CreditNonZeroException();
    }
  }

  public addCredit(amount: number): void {
    this.credit.add(new Credit(amount));
    this.touch();
    this.record(
      new CreditAddedEvent(this.id.getValue(), amount, this.credit.getValue()),
    );
  }

  public delete(): void {
    this.record(new DeleteCustomerEvent(this.id.getValue()));
  }

  public hasCredit(): boolean {
    return this.credit.isPositive();
  }

  private touch() {
    this.updatedAt = new DateValue();
  }

  private record(event: DomainEvent): void {
    this.events.push(event);
  }

  public pullEvents(): DomainEvent[] {
    const recorded = [...this.events];
    this.events.length = 0;
    return recorded;
  }

  public toJson(): CustomerObject {
    return {
      id: this.id.getValue(),
      firstName: this.firstName.getValue(),
      lastName: this.lastName.getValue(),
      email: this.email.getValue(),
      credit: this.credit.getValue(),
      phone: this.phone?.getValue(),
      createdAt: this.createdAt?.getValue(),
      updatedAt: this.updatedAt?.getValue(),
    };
  }

  public toRawJson(): CustomerObject {
    return {
      id: this.id.getValue(),
      firstName: this.firstName.getValue(),
      lastName: this.lastName.getValue(),
      email: this.email.getValue(),
      credit: this.credit.toCents().getValue(),
      phone: this.phone?.getValue(),
      createdAt: this.createdAt?.getValue(),
      updatedAt: this.updatedAt?.getValue(),
    };
  }
}
