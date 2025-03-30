import {
  AddCreditToCustomerCommand,
  AddCreditToCustomerHandler,
} from '@/customer/application';
import { Customer, CustomerRepositoryPort, UUID } from '@/customer/domain';
import { EventPublisherPort } from '@/shared/domain';
import { fixedDate, fixedUUID } from '@/test/setup';

describe('AddCreditToCustomerHandler', () => {
  let handler: AddCreditToCustomerHandler;
  let mockCustomerRepository: jest.Mocked<CustomerRepositoryPort>;
  let mockEventPublisher: jest.Mocked<EventPublisherPort>;

  const existingCustomer = Customer.create({
    id: fixedUUID,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    credit: 100,
    createdAt: fixedDate,
    updatedAt: fixedDate,
  });

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

    handler = new AddCreditToCustomerHandler(
      mockCustomerRepository,
      mockEventPublisher,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should add credit and publish events', async () => {
    const credit = 50;
    const command = new AddCreditToCustomerCommand(fixedUUID, credit);
    const updatedCustomer = existingCustomer;
    updatedCustomer.addCredit(credit);
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
    expect(result.credit).toBe(updatedCustomer.credit.getValue());
  });

  it('should handle decimal credit amounts', async () => {
    const credit = 50.5;
    const command = new AddCreditToCustomerCommand(fixedUUID, credit);
    const updatedCustomer = existingCustomer;
    updatedCustomer.addCredit(credit);
    mockCustomerRepository.update.mockResolvedValue(updatedCustomer);
    const result = await handler.execute(command);
    expect(result.credit).toBe(updatedCustomer.credit.getValue());
  });
});
