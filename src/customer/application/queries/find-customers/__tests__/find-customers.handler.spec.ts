import { FindCustomersHandler } from '../find-customers.handler';
import { FindCustomersQuery } from '../find-customers.query';
import { CustomerRepositoryPort, Customer } from '@/customer/domain';
import { CustomerToResponseMapper } from '@/customer/infrastructure/mappers';
import { fixedDate, fixedUUID } from '@/test/setup';

describe('FindCustomersHandler', () => {
  let handler: FindCustomersHandler;
  let mockCustomerRepository: jest.Mocked<CustomerRepositoryPort>;

  const mockCustomers = [
    Customer.create({
      id: fixedUUID,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      createdAt: fixedDate,
      updatedAt: fixedDate,
    }),
    Customer.create({
      id: '987fcdeb-51a2-4121-b543-789123456789',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      createdAt: fixedDate,
      updatedAt: fixedDate,
    }),
  ];

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedDate);

    mockCustomerRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      getCount: jest.fn(),
      update: jest.fn(),
    };

    handler = new FindCustomersHandler(mockCustomerRepository);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return paginated customers with default values', async () => {
    const query = new FindCustomersQuery();
    mockCustomerRepository.findAll.mockResolvedValue(mockCustomers);
    mockCustomerRepository.getCount.mockResolvedValue(2);

    const result = await handler.execute(query);

    expect(result).toEqual({
      data: CustomerToResponseMapper.mapArray(mockCustomers),
      total: 2,
      limit: 10,
      page: 1,
      totalPages: 1,
    });
  });

  it('should calculate total pages correctly', async () => {
    const query = new FindCustomersQuery();
    query.limit = 2;
    query.page = 1;

    mockCustomerRepository.findAll.mockResolvedValue(mockCustomers);
    mockCustomerRepository.getCount.mockResolvedValue(5);

    const result = await handler.execute(query);

    expect(result.totalPages).toBe(3);
  });

  it('should pass filters to repository', async () => {
    const query = new FindCustomersQuery();
    query.firstName = 'John';
    query.sortBy = 'credit';
    query.sortDirection = 'desc';
    query.limit = 5;
    query.page = 2;

    mockCustomerRepository.findAll.mockResolvedValue([mockCustomers[0]]);
    mockCustomerRepository.getCount.mockResolvedValue(1);

    await handler.execute(query);

    expect(mockCustomerRepository.findAll).toHaveBeenCalledWith(query);
  });

  it('should handle empty result set', async () => {
    const query = new FindCustomersQuery();
    mockCustomerRepository.findAll.mockResolvedValue([]);
    mockCustomerRepository.getCount.mockResolvedValue(0);

    const result = await handler.execute(query);

    expect(result).toEqual({
      data: [],
      total: 0,
      limit: 10,
      page: 1,
      totalPages: 0,
    });
  });

  it('should handle null filter', async () => {
    mockCustomerRepository.findAll.mockResolvedValue(mockCustomers);
    mockCustomerRepository.getCount.mockResolvedValue(2);

    const result = await handler.execute(null);

    expect(result).toEqual({
      data: CustomerToResponseMapper.mapArray(mockCustomers),
      total: 2,
      limit: 10,
      page: 1,
      totalPages: 1,
    });
  });
});
