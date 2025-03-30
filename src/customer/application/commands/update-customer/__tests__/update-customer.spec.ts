import {
  UpdateCustomerCommand,
  UpdateCustomerHandler,
} from '@/customer/application';
import { Customer, CustomerRepositoryPort, UUID } from '@/customer/domain';
import { EventPublisherPort } from '@/shared/domain';
import { fixedDate, fixedUUID } from '@/test/setup';

describe('UpdateCustomerHandler', () => {
  let handler: UpdateCustomerHandler;
  let mockCustomerRepository: jest.Mocked<CustomerRepositoryPort>;
  let mockEventPublisher: jest.Mocked<EventPublisherPort>;

  const existingCustomer = Customer.create({
    id: fixedUUID,
    firstName: 'Old',
    lastName: 'Name',
    email: 'old@example.com',
    createdAt: fixedDate,
    updatedAt: fixedDate,
  });

  const command = new UpdateCustomerCommand(
    fixedUUID,
    'John',
    'Doe',
    'john.doe@example.com',
    '+1234567890',
  );

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedDate);

    mockCustomerRepository = {
      findOne: jest.fn().mockResolvedValue(existingCustomer),
      update: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      getCount: jest.fn(),
    };

    mockEventPublisher = {
      publish: jest.fn(),
    };

    handler = new UpdateCustomerHandler(
      mockCustomerRepository,
      mockEventPublisher,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should update customer and publish events', async () => {
    const updatedCustomer = existingCustomer.update(command);
    mockCustomerRepository.update.mockResolvedValue(updatedCustomer);

    const result = await handler.execute(command);

    expect(mockCustomerRepository.findOne).toHaveBeenCalledWith(
      expect.any(UUID),
    );
    expect(mockCustomerRepository.update).toHaveBeenCalledWith(
      expect.any(Customer),
    );
    expect(mockEventPublisher.publish).toHaveBeenCalled();
    expect(result).toEqual(updatedCustomer.toJson());
  });
});
