import { InvalidEmailException } from '@/customer/domain';

export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValidEmail(email)) {
      throw new InvalidEmailException(email);
    }
    this.value = email;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  }

  getValue(): string {
    return this.value;
  }
}
