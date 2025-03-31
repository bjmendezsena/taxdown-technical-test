import Decimal from 'decimal.js';
import { InvalidCreditException } from '@/customer/domain';

export class Credit {
  public static readonly DECIMAL_CENTS = 100;
  private value: Decimal;

  constructor(initialAmount: number) {
    if (initialAmount === undefined) {
      throw new InvalidCreditException('Invalid amount');
    }
    this.value = new Decimal(initialAmount);
    this.validateAmount(this.value);
  }

  private validateAmount(amount: Decimal): void {
    if (amount.isNaN() || !amount.isFinite()) {
      throw new InvalidCreditException('Invalid amount');
    }
  }

  public isPositive(): boolean {
    return this.value.greaterThanOrEqualTo(0);
  }

  add(amount: Credit): Credit {
    amount.toCents();
    this.toCents();
    const newValue = this.value.plus(amount.value).toNumber();
    this.value = new Decimal(newValue);
    this.round();
    this.toCreditUnit();
    return this;
  }

  getValue(): number {
    return this.toNumber();
  }

  public round(): Credit {
    this.value = this.value.toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
    return this;
  }

  public toCents(): Credit {
    this.value = this.value.mul(Credit.DECIMAL_CENTS);
    return this;
  }

  public toNumber(): number {
    return this.value.toNumber();
  }

  public toCreditUnit(): Credit {
    this.value = this.value.dividedBy(Credit.DECIMAL_CENTS);
    return this;
  }
}
