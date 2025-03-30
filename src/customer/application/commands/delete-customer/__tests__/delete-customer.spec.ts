import {
  DeleteCustomerCommand,
  DeleteCustomerHandler,
} from '@/customer/application';
import { Customer, CustomerRepositoryPort, UUID } from '@/customer/domain';
import { EventPublisherPort } from '@/shared/domain';
import { fixedDate, fixedUUID } from '@/test/setup';

describe('DeleteCustomerHandler', () => {
  let handler: DeleteCustomerHandler;
  let mockCustomerRepository: jest.Mocked<CustomerRepositoryPort>;
  let mockEventPublisher: jest.Mocked<EventPublisherPort>;

  const existingCustomer = Customer.create({
    id: fixedUUID,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    createdAt: fixedDate,
    updatedAt: fixedDate,
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedDate);

    mockCustomerRepository = {
      findOne: jest.fn().mockResolvedValue(existingCustomer),
      delete: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      getCount: jest.fn(),
    };

    mockEventPublisher = {
      publish: jest.fn(),
    };

    handler = new DeleteCustomerHandler(
      mockCustomerRepository,
      mockEventPublisher,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should delete customer and publish events', async () => {
    const command = new DeleteCustomerCommand(fixedUUID);

    await handler.execute(command);

    expect(mockCustomerRepository.findOne).toHaveBeenCalledWith(
      expect.any(UUID),
    );
    expect(mockCustomerRepository.delete).toHaveBeenCalledWith(
      expect.any(UUID),
    );
    expect(mockEventPublisher.publish).toHaveBeenCalled();
  });
});
