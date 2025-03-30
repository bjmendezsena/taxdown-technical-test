import { validate } from 'class-validator';
import { UpdateCustomerDto } from '@/customer/infrastructure';

describe('UpdateCustomerDto', () => {
  it('should validate a valid DTO', async () => {
    const dto = new UpdateCustomerDto();
    dto.firstName = 'John';
    dto.lastName = 'Doe';
    dto.email = 'john.doe@example.com';
    dto.phone = '+1234567890';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate DTO without phone', async () => {
    const dto = new UpdateCustomerDto();
    dto.firstName = 'John';
    dto.lastName = 'Doe';
    dto.email = 'john.doe@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with invalid email', async () => {
    const dto = new UpdateCustomerDto();
    dto.firstName = 'John';
    dto.lastName = 'Doe';
    dto.email = 'invalid-email';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail with missing required fields', async () => {
    const dto = new UpdateCustomerDto();
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
