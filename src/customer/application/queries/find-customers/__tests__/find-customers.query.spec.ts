import { validate } from 'class-validator';
import { FindCustomersQuery } from '../find-customers.query';

describe('FindCustomersQuery', () => {
  it('should validate with empty query', async () => {
    const query = new FindCustomersQuery();
    const errors = await validate(query);
    expect(errors).toHaveLength(0);
  });

  it('should validate with all optional fields', async () => {
    const query = new FindCustomersQuery();
    query.firstName = 'John';
    query.lastName = 'Doe';
    query.email = 'john@example.com';
    query.phone = '+1234567890';
    query.sortBy = 'credit';
    query.sortDirection = 'asc';
    query.limit = 10;
    query.page = 1;

    const errors = await validate(query);
    expect(errors).toHaveLength(0);
  });

  it('should fail with invalid sort direction', async () => {
    const query = new FindCustomersQuery();
    query.sortDirection = 'invalid' as any;

    const errors = await validate(query);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('sortDirection');
    expect(errors[0].constraints).toHaveProperty('isIn');
  });

  it('should fail with invalid number types', async () => {
    const query = new FindCustomersQuery();
    query.limit = 'invalid' as any;
    query.page = 'invalid' as any;

    const errors = await validate(query);
    expect(errors).toHaveLength(2);
    expect(errors.map((e) => e.property)).toContain('limit');
    expect(errors.map((e) => e.property)).toContain('page');
  });
});
