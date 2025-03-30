import { InvalidPhoneException } from '@/customer/domain';

export class Phone {
  public static readonly PHONE_REGEX = /^[+0-9\s\-()]{7,20}$/;
  private readonly value: string;

  constructor(phone: string) {
    if (!this.isValidPhone(phone)) {
      throw new InvalidPhoneException(phone);
    }
    this.value = phone;
  }

  private isValidPhone(phone: string): boolean {
    return Phone.PHONE_REGEX.test(phone);
  }

  getValue(): string {
    return this.value;
  }
}
