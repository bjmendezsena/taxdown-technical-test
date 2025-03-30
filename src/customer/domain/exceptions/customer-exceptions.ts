import { BadRequestException, NotFoundException } from '@nestjs/common';

export class InvalidEmailException extends BadRequestException {
  constructor(email: string) {
    super(`Invalid email format: ${email}`);
  }
}

export class InvalidCreditException extends BadRequestException {
  constructor(reason: string) {
    super(`Invalid credit: ${reason}`);
  }
}

export class InvalidPhoneException extends BadRequestException {
  constructor(phone: string) {
    super(`Invalid phone number: ${phone}`);
  }
}

export class CustomerNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Customer with id ${id} not found`);
  }
}

export class CustomerAlreadyExistsException extends BadRequestException {
  constructor(email: string) {
    super(`Customer with email ${email} already exists`);
  }
}

export class CreditNonZeroException extends BadRequestException {
  constructor() {
    super(`Credit must be greater than zero`);
  }
}
