import { validate } from 'class-validator';
import { FindCustomerQuery } from '../find-customer.query';

describe('FindCustomerQuery', () => {
  it('should create a valid query with UUID', async () => {
    const validUUID = '123e4567-e89b-12d3-a456-426614174000';
    const query = new FindCustomerQuery(validUUID);

    const errors = await validate(query);

    expect(errors).toHaveLength(0);
    expect(query.id).toBe(validUUID);
  });

  it('should fail validation with invalid UUID', async () => {
    const invalidUUID = 'not-a-uuid';
    const query = new FindCustomerQuery(invalidUUID);

    const errors = await validate(query);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('id');
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });
});
