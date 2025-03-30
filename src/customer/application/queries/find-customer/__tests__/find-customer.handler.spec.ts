import { FindCustomerQuery, FindCustomerHandler } from '@/customer/application';
import { CustomerRepositoryPort, Customer, UUID } from '@/customer/domain';
import { fixedDate, fixedUUID } from '@/test/setup';

describe('FindCustomerHandler', () => {
  let handler: FindCustomerHandler;
  let mockCustomerRepository: jest.Mocked<CustomerRepositoryPort>;

  const mockCustomer = Customer.create({
    id: fixedUUID,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    createdAt: fixedDate,
    updatedAt: fixedDate,
  });

  beforeEach(() => {
    // Reset the mock date for each test
    jest.useFakeTimers();
    jest.setSystemTime(fixedDate);

    mockCustomerRepository = {
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      getCount: jest.fn(),
      update: jest.fn(),
    };

    handler = new FindCustomerHandler(mockCustomerRepository);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should find and return customer by id', async () => {
    const query = new FindCustomerQuery(fixedUUID);
    mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);

    const result = await handler.execute(query);

    expect(mockCustomerRepository.findOne).toHaveBeenCalledWith(
      expect.any(UUID),
    );
    expect(result).toEqual(mockCustomer.toJson());
  });

  it('should pass UUID instance to repository', async () => {
    const query = new FindCustomerQuery(fixedUUID);
    mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);

    await handler.execute(query);

    const callArg = mockCustomerRepository.findOne.mock.calls[0][0];
    expect(callArg).toBeInstanceOf(UUID);
    expect(callArg.getValue()).toBe(fixedUUID);
  });

  it('should return JSON representation of customer', async () => {
    const query = new FindCustomerQuery(fixedUUID);
    mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
    const result = await handler.execute(query);

    expect(result).toEqual({
      id: fixedUUID,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      credit: 0,
      createdAt: fixedDate,
      updatedAt: fixedDate,
    });
  });
});
