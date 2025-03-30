import {
  UpdateCustomerCommand,
  UpdateCustomerHandler,
} from '@/customer/application';
import {
  Customer,
  CustomerRepositoryPort,
  UUID,
  InvalidEmailException,
  InvalidPhoneException,
} from '@/customer/domain';
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
    phone: '+1234567890',
    createdAt: fixedDate,
    updatedAt: fixedDate,
  });

  const validCommand = new UpdateCustomerCommand(
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
    jest.clearAllMocks();
  });

  it('should update customer with all fields and publish events', async () => {
    const updatedCustomer = existingCustomer.update(validCommand);
    mockCustomerRepository.update.mockResolvedValue(updatedCustomer);

    const result = await handler.execute(validCommand);

    expect(mockCustomerRepository.findOne).toHaveBeenCalledWith(
      expect.any(UUID),
    );
    expect(mockCustomerRepository.update).toHaveBeenCalledWith(
      expect.any(Customer),
    );
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          customerId: fixedUUID,
          firstName: validCommand.firstName,
          lastName: validCommand.lastName,
          email: validCommand.email,
          phone: validCommand.phone,
          occurredAt: fixedDate,
        }),
      ]),
    );
    expect(result).toEqual(updatedCustomer.toJson());
  });

  it('should update customer without phone number', async () => {
    const commandWithoutPhone = new UpdateCustomerCommand(
      fixedUUID,
      'John',
      'Doe',
      'john.doe@example.com',
    );
    const updatedCustomer = existingCustomer.update(commandWithoutPhone);
    mockCustomerRepository.update.mockResolvedValue(updatedCustomer);
    const result = await handler.execute(commandWithoutPhone);
    expect(result.phone).toBeUndefined();
    expect(mockCustomerRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        phone: null,
      }),
    );
  });

  it('should throw InvalidEmailException for invalid email format', async () => {
    const invalidEmailCommand = new UpdateCustomerCommand(
      fixedUUID,
      'John',
      'Doe',
      'invalid-email',
      '+1234567890',
    );

    await expect(handler.execute(invalidEmailCommand)).rejects.toThrow(
      InvalidEmailException,
    );
  });

  it('should throw InvalidPhoneException for invalid phone format', async () => {
    const invalidPhoneCommand = new UpdateCustomerCommand(
      fixedUUID,
      'John',
      'Doe',
      'john.doe@example.com',
      'invalid-phone',
    );

    await expect(handler.execute(invalidPhoneCommand)).rejects.toThrow(
      InvalidPhoneException,
    );
  });

  it('should maintain unchanged fields', async () => {
    const partialCommand = new UpdateCustomerCommand(
      fixedUUID,
      'John',
      'Doe',
      existingCustomer.email.getValue(),
      existingCustomer.phone.getValue(),
    );

    const updatedCustomer = existingCustomer.update(partialCommand);
    mockCustomerRepository.update.mockResolvedValue(updatedCustomer);

    const result = await handler.execute(partialCommand);

    expect(result.email).toBe(existingCustomer.email.getValue());
    expect(result.phone).toBe(existingCustomer.phone.getValue());
  });

  it('should handle repository errors properly', async () => {
    mockCustomerRepository.update.mockRejectedValue(
      new Error('Database error'),
    );

    await expect(handler.execute(validCommand)).rejects.toThrow(
      'Database error',
    );
  });

  it('should validate UUID format', async () => {
    const invalidUUIDCommand = new UpdateCustomerCommand(
      'invalid-uuid',
      'John',
      'Doe',
      'john.doe@example.com',
      '+1234567890',
    );

    await expect(handler.execute(invalidUUIDCommand)).rejects.toThrow();
  });
});
