import { Test, TestingModule } from '@nestjs/testing';
import {
  AddCreditToCustomerHandler,
  CreateCustomerHandler,
  DeleteCustomerHandler,
  FindCustomerHandler,
  FindCustomersHandler,
  UpdateCustomerHandler,
} from '@/customer/application';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  AddCreditToCustomerCustomerDto,
  CustomerController,
} from '@/customer/infrastructure';
import { fixedUUID, fixedDate } from '@/test/setup';

describe('CustomerController', () => {
  let controller: CustomerController;
  let createCustomerHandler: jest.Mocked<CreateCustomerHandler>;
  let updateCustomerHandler: jest.Mocked<UpdateCustomerHandler>;
  let deleteCustomerHandler: jest.Mocked<DeleteCustomerHandler>;
  let findCustomerHandler: jest.Mocked<FindCustomerHandler>;
  let findCustomersHandler: jest.Mocked<FindCustomersHandler>;
  let addCreditToCustomerHandler: jest.Mocked<AddCreditToCustomerHandler>;

  const mockCustomerResponse = {
    id: fixedUUID,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    credit: 1000,
    createdAt: fixedDate,
    updatedAt: fixedDate,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CreateCustomerHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateCustomerHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteCustomerHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindCustomerHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindCustomersHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: AddCreditToCustomerHandler,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    createCustomerHandler = module.get(CreateCustomerHandler);
    updateCustomerHandler = module.get(UpdateCustomerHandler);
    deleteCustomerHandler = module.get(DeleteCustomerHandler);
    findCustomerHandler = module.get(FindCustomerHandler);
    findCustomersHandler = module.get(FindCustomersHandler);
    addCreditToCustomerHandler = module.get(AddCreditToCustomerHandler);
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const dto: CreateCustomerDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
      };

      createCustomerHandler.execute.mockResolvedValue(mockCustomerResponse);

      const result = await controller.create(dto);

      expect(createCustomerHandler.execute).toHaveBeenCalled();
      expect(result).toEqual(mockCustomerResponse);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const dto: UpdateCustomerDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
      };

      updateCustomerHandler.execute.mockResolvedValue(mockCustomerResponse);

      const result = await controller.update(dto, fixedUUID);

      expect(updateCustomerHandler.execute).toHaveBeenCalled();
      expect(result).toEqual(mockCustomerResponse);
    });
  });

  describe('addCredit', () => {
    it('should add credit to customer', async () => {
      const dto: AddCreditToCustomerCustomerDto = {
        credit: 500,
      };

      addCreditToCustomerHandler.execute.mockResolvedValue(
        mockCustomerResponse,
      );

      const result = await controller.addCreditcreate(dto, fixedUUID);

      expect(addCreditToCustomerHandler.execute).toHaveBeenCalled();
      expect(result).toEqual(mockCustomerResponse);
    });
  });

  describe('findAll', () => {
    it('should return all customers with pagination', async () => {
      const mockPaginatedResponse = {
        data: [mockCustomerResponse],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      findCustomersHandler.execute.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll({});

      expect(findCustomersHandler.execute).toHaveBeenCalled();
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should apply filters when provided', async () => {
      const filters = {
        firstName: 'John',
        email: 'john.doe@example.com',
        page: 1,
        limit: 10,
      };

      findCustomersHandler.execute.mockResolvedValue({
        data: [mockCustomerResponse],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      await controller.findAll(filters);

      expect(findCustomersHandler.execute).toHaveBeenCalledWith(filters);
    });
  });

  describe('findOne', () => {
    it('should return one customer', async () => {
      findCustomerHandler.execute.mockResolvedValue(mockCustomerResponse);

      const result = await controller.fondOne(fixedUUID);

      expect(findCustomerHandler.execute).toHaveBeenCalled();
      expect(result).toEqual(mockCustomerResponse);
    });
  });

  describe('delete', () => {
    it('should delete a customer', async () => {
      deleteCustomerHandler.execute.mockResolvedValue(undefined);

      await controller.delete(fixedUUID);

      expect(deleteCustomerHandler.execute).toHaveBeenCalled();
    });
  });
});
