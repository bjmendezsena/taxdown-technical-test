import {
  CreateCustomerCommand,
  CreateCustomerHandler,
} from '@/customer/application';
import { Customer, CustomerRepositoryPort } from '@/customer/domain';
import { EventPublisherPort } from '@/shared/domain';
import { fixedDate } from '@/test/setup';

describe('CreateCustomerHandler', () => {
  let handler: CreateCustomerHandler;
  let mockCustomerRepository: jest.Mocked<CustomerRepositoryPort>;
  let mockEventPublisher: jest.Mocked<EventPublisherPort>;

  const command = new CreateCustomerCommand(
    'John',
    'Doe',
    'john.doe@example.com',
    '+1234567890',
  );

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedDate);

    mockCustomerRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getCount: jest.fn(),
    };

    mockEventPublisher = {
      publish: jest.fn(),
    };

    handler = new CreateCustomerHandler(
      mockCustomerRepository,
      mockEventPublisher,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create a customer and publish events', async () => {
    const customer = Customer.create({
      ...command,
      createdAt: fixedDate,
      updatedAt: fixedDate,
    });

    mockCustomerRepository.create.mockResolvedValue(customer);

    const result = await handler.execute(command);

    expect(mockCustomerRepository.create).toHaveBeenCalledWith(
      expect.any(Customer),
    );
    expect(mockEventPublisher.publish).toHaveBeenCalled();
    expect(result).toEqual(customer.toJson());
  });
});
