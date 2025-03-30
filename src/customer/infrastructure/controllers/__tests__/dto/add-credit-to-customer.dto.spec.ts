import { validate } from 'class-validator';
import { AddCreditToCustomerCustomerDto } from '@/customer/infrastructure';

describe('AddCreditToCustomerCustomerDto', () => {
  it('should validate a valid DTO', async () => {
    const dto = new AddCreditToCustomerCustomerDto();
    dto.credit = 1000;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with missing credit', async () => {
    const dto = new AddCreditToCustomerCustomerDto();
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail with non-numeric credit', async () => {
    const dto = new AddCreditToCustomerCustomerDto();
    (dto as any).credit = 'invalid';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });
});
