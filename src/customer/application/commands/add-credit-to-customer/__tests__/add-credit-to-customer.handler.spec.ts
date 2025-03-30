import {
  AddCreditToCustomerCommand,
  AddCreditToCustomerHandler,
} from '@/customer/application';
import {
  Customer,
  CustomerRepositoryPort,
  UUID,
  InvalidCreditException,
  CreditNonZeroException,
} from '@/customer/domain';
import { EventPublisherPort } from '@/shared/domain';
import { fixedDate, fixedUUID } from '@/test/setup';

describe('AddCreditToCustomerHandler', () => {
  let handler: AddCreditToCustomerHandler;
  let mockCustomerRepository: jest.Mocked<CustomerRepositoryPort>;
  let mockEventPublisher: jest.Mocked<EventPublisherPort>;

  let existingCustomer: Customer;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedDate);
    existingCustomer = Customer.create({
      id: fixedUUID,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      credit: 100,
      createdAt: fixedDate,
      updatedAt: fixedDate,
    });

    mockCustomerRepository = {
      findOne: jest.fn().mockResolvedValue(existingCustomer),
      update: jest.fn().mockResolvedValue(existingCustomer),
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

    jest.clearAllMocks();
  });

  it('should successfully add credit to customer', async () => {
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

  it('should handle decimal credit amounts correctly', async () => {
    const credit = 50.5;
    const command = new AddCreditToCustomerCommand(fixedUUID, credit);
    const updatedCustomer = existingCustomer;
    updatedCustomer.addCredit(credit);
    mockCustomerRepository.update.mockResolvedValue(updatedCustomer);
    const result = await handler.execute(command);
    expect(result.credit).toBe(updatedCustomer.credit.getValue());
  });

  it('should throw CreditNonZeroException for negative credit', async () => {
    const command = new AddCreditToCustomerCommand(fixedUUID, -500);

    await expect(handler.execute(command)).rejects.toThrow(
      CreditNonZeroException,
    );
  });

  it('should throw InvalidCreditException for negative credit', async () => {
    const command = new AddCreditToCustomerCommand(fixedUUID, Infinity);

    await expect(handler.execute(command)).rejects.toThrow(
      InvalidCreditException,
    );
  });

  it('should publish events after successful credit addition', async () => {
    const credit = 50;
    const command = new AddCreditToCustomerCommand(fixedUUID, credit);
    const updatedCustomer = existingCustomer;
    updatedCustomer.addCredit(credit);
    mockCustomerRepository.update.mockResolvedValue(updatedCustomer);
    await handler.execute(command);
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          customerId: fixedUUID,
          amount: credit,
          newTotalCredit: updatedCustomer.credit.getValue(),
        }),
      ]),
    );
  });

  it('should handle zero credit amount', async () => {
    const command = new AddCreditToCustomerCommand(fixedUUID, 0);
    const updatedCustomer = existingCustomer;
    mockCustomerRepository.update.mockResolvedValue(updatedCustomer);
    const result = await handler.execute(command);
    expect(result.credit).toBe(updatedCustomer.credit.getValue());
  });
});
