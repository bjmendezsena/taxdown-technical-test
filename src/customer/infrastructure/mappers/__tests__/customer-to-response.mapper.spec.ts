import { CustomerToResponseMapper } from '@/customer/infrastructure';
import { Customer } from '@/customer/domain';
import { fixedDate, fixedUUID } from '@/test/setup';

describe('CustomerToResponseMapper', () => {
  const customer = Customer.create({
    id: fixedUUID,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    credit: 100,
    createdAt: fixedDate,
    updatedAt: fixedDate,
  });

  it('should map single customer to response', () => {
    const response = CustomerToResponseMapper.map(customer);

    expect(response).toEqual({
      id: fixedUUID,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      credit: 100,
      createdAt: fixedDate,
      updatedAt: fixedDate,
    });
  });

  it('should map array of customers to response', () => {
    const customers = [customer, customer];
    const response = CustomerToResponseMapper.mapArray(customers);

    expect(response).toHaveLength(2);
    expect(response).toEqual([
      CustomerToResponseMapper.map(customer),
      CustomerToResponseMapper.map(customer),
    ]);
  });

  it('should map customer without phone to response', () => {
    const customerWithoutPhone = Customer.create({
      id: fixedUUID,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      createdAt: fixedDate,
      updatedAt: fixedDate,
    });

    const response = CustomerToResponseMapper.map(customerWithoutPhone);

    expect(response.phone).toBeUndefined();
  });

  it('should map empty array to empty response', () => {
    const response = CustomerToResponseMapper.mapArray([]);

    expect(response).toEqual([]);
  });
});
