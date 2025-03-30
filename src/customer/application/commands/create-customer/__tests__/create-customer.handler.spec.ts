import {
  CreateCustomerCommand,
  CreateCustomerHandler,
} from '@/customer/application';
import {
  Customer,
  CustomerRepositoryPort,
  CustomerAlreadyExistsException,
  InvalidEmailException,
  InvalidPhoneException,
} from '@/customer/domain';
import { EventPublisherPort } from '@/shared/domain';
import { fixedDate } from '@/test/setup';

describe('CreateCustomerHandler', () => {
  let handler: CreateCustomerHandler;
  let mockCustomerRepository: jest.Mocked<CustomerRepositoryPort>;
  let mockEventPublisher: jest.Mocked<EventPublisherPort>;

  const validCommand = new CreateCustomerCommand(
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
    jest.clearAllMocks();
  });

  it('should create a customer successfully with all fields', async () => {
    const customer = Customer.create({
      ...validCommand,
      createdAt: fixedDate,
      updatedAt: fixedDate,
    });
    mockCustomerRepository.create.mockResolvedValue(customer);
    const result = await handler.execute(validCommand);
    expect(mockCustomerRepository.create).toHaveBeenCalledWith(
      expect.any(Customer),
    );
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          firstName: validCommand.firstName,
          lastName: validCommand.lastName,
          email: validCommand.email,
          phone: validCommand.phone,
        }),
      ]),
    );
    expect(result).toEqual(customer.toJson());
  });

  it('should create a customer without phone number', async () => {
    const commandWithoutPhone = new CreateCustomerCommand(
      'John',
      'Doe',
      'john.doe@example.com',
    );
    const customer = Customer.create({
      ...commandWithoutPhone,
      createdAt: fixedDate,
      updatedAt: fixedDate,
    });
    mockCustomerRepository.create.mockResolvedValue(customer);
    const result = await handler.execute(commandWithoutPhone);
    expect(result.phone).toBeUndefined();
    expect(mockCustomerRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        phone: null,
      }),
    );
  });

  it('should throw CustomerAlreadyExistsException when email exists', async () => {
    mockCustomerRepository.create.mockRejectedValue(
      new CustomerAlreadyExistsException(validCommand.email),
    );
    await expect(handler.execute(validCommand)).rejects.toThrow(
      CustomerAlreadyExistsException,
    );
  });

  it('should throw InvalidEmailException for invalid email format', async () => {
    const invalidEmailCommand = new CreateCustomerCommand(
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
    const invalidPhoneCommand = new CreateCustomerCommand(
      'John',
      'Doe',
      'john.doe@example.com',
      'invalid-phone',
    );
    await expect(handler.execute(invalidPhoneCommand)).rejects.toThrow(
      InvalidPhoneException,
    );
  });

  it('should publish CustomerCreatedEvent after successful creation', async () => {
    const customer = Customer.create({
      ...validCommand,
      createdAt: fixedDate,
      updatedAt: fixedDate,
    });
    mockCustomerRepository.create.mockResolvedValue(customer);
    await handler.execute(validCommand);
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          firstName: validCommand.firstName,
          lastName: validCommand.lastName,
          email: validCommand.email,
          phone: validCommand.phone,
          occurredAt: fixedDate,
        }),
      ]),
    );
  });

  it('should handle repository errors properly', async () => {
    mockCustomerRepository.create.mockRejectedValue(
      new Error('Database error'),
    );
    await expect(handler.execute(validCommand)).rejects.toThrow(
      'Database error',
    );
  });
});
