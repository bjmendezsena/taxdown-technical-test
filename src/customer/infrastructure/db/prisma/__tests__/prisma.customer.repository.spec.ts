import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/shared/infrastructure';
import { PrismaCustomerRepository } from '@/customer/infrastructure';
import {
  Customer,
  CustomerNotFoundException,
  CustomerAlreadyExistsException,
  UUID,
  CustomerFilter,
} from '@/customer/domain';
import { fixedDate, fixedUUID } from '@/test/setup';

describe('PrismaCustomerRepository', () => {
  let repository: PrismaCustomerRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const count = 10;

  const mockCustomerData = {
    id: fixedUUID,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    credit: 1000,
    createdAt: fixedDate,
    updatedAt: fixedDate,
  };

  const mockCustomer = Customer.reconstitute(mockCustomerData);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaCustomerRepository,
        {
          provide: PrismaService,
          useValue: {
            customer: {
              findFirst: jest.fn().mockResolvedValue(mockCustomerData),
              findMany: jest.fn().mockResolvedValue([mockCustomerData]),
              create: jest.fn().mockResolvedValue(mockCustomerData),
              update: jest.fn().mockResolvedValue((val: Customer) => {
                return val;
              }),
              delete: jest.fn(),
              count: jest.fn().mockResolvedValue(count),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaCustomerRepository>(PrismaCustomerRepository);
    prismaService = module.get(PrismaService);
  });

  describe('getCount', () => {
    it('should return the total count of customers', async () => {
      const result = await repository.getCount();

      expect(result).toBe(count);
      expect(prismaService.customer.count).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find and return a customer by id', async () => {
      //   prismaService.customer.findFirst.mockResolvedValue(mockCustomerData);
      const result = await repository.findOne(UUID.create(fixedUUID));

      expect(prismaService.customer.findFirst).toHaveBeenCalledWith({
        where: { id: fixedUUID },
      });
      expect(result).toBeInstanceOf(Customer);
      const jsonData = mockCustomer.toJson();
      expect(result.toJson()).toEqual(jsonData);
    });

    it('should throw CustomerNotFoundException when customer not found', async () => {
      //@ts-expect-error: Ignore for testing
      prismaService.customer.findFirst.mockResolvedValue(null);
      await expect(repository.findOne(UUID.create(fixedUUID))).rejects.toThrow(
        CustomerNotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return filtered and paginated customers', async () => {
      const filter: CustomerFilter = {
        firstName: 'John',
        email: 'john',
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortDirection: 'asc' as const,
      };
      const result = await repository.findAll(filter);
      expect(prismaService.customer.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        where: expect.objectContaining({
          firstName: { contains: 'John', mode: 'insensitive' },
          email: { contains: 'john', mode: 'insensitive' },
        }),
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Customer);
    });

    it('should use default values when no filter provided', async () => {
      await repository.findAll();
      expect(prismaService.customer.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        where: expect.any(Object),
        orderBy: { createdAt: 'asc' },
      });
    });
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      //@ts-expect-error: Is for testing
      prismaService.customer.findFirst.mockResolvedValue(null);
      const result = await repository.create(mockCustomer);
      expect(prismaService.customer.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          firstName: mockCustomerData.firstName,
          lastName: mockCustomerData.lastName,
          email: mockCustomerData.email,
        }),
      });
      expect(result).toBeInstanceOf(Customer);
      expect(result.id.getValue()).toBe(fixedUUID);
    });

    it('should throw CustomerAlreadyExistsException when email exists', async () => {
      await expect(repository.create(mockCustomer)).rejects.toThrow(
        CustomerAlreadyExistsException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing customer', async () => {
      //@ts-expect-error: Ignore for testing
      prismaService.customer.update.mockResolvedValue({
        ...mockCustomerData,
        firstName: 'Updated',
      });
      const updatedCustomer = Customer.reconstitute({
        ...mockCustomerData,
        firstName: 'Updated',
      });
      const result = await repository.update(updatedCustomer);
      expect(prismaService.customer.update).toHaveBeenCalledWith({
        where: { id: fixedUUID },
        data: expect.objectContaining({
          firstName: 'Updated',
        }),
      });
      expect(result).toBeInstanceOf(Customer);
      expect(result.firstName.getValue()).toBe('Updated');
    });

    it('should throw CustomerNotFoundException when updating non-existent customer', async () => {
      //@ts-expect-error: Ignore for testing
      prismaService.customer.findFirst.mockResolvedValue(null);
      await expect(repository.update(mockCustomer)).rejects.toThrow(
        CustomerNotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing customer', async () => {
      await repository.delete(UUID.create(fixedUUID));
      expect(prismaService.customer.delete).toHaveBeenCalledWith({
        where: { id: fixedUUID },
      });
    });

    it('should throw CustomerNotFoundException when deleting non-existent customer', async () => {
      //@ts-expect-error: Ignore for testing
      prismaService.customer.findFirst.mockResolvedValue(null);
      await expect(repository.delete(UUID.create(fixedUUID))).rejects.toThrow(
        CustomerNotFoundException,
      );
    });
  });
});
