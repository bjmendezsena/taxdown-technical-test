import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends BadRequestException {
  constructor(errors: ValidationError[]) {
    super(
      `${errors.map((error) => Object.values(error.constraints).join(', ')).join(', ')}`,
    );
  }
}
