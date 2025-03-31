import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AddCreditToCustomerCommand,
  AddCreditToCustomerHandler,
  CreateCustomerHandler,
  DeleteCustomerCommand,
  DeleteCustomerHandler,
  FindCustomerHandler,
  FindCustomerQuery,
  FindCustomersHandler,
  FindCustomersQuery,
  UpdateCustomerHandler,
} from '@/customer/application';
import {
  AddCreditToCustomerCustomerDto,
  CreateCustomerDto,
  CreateCustomerMapper,
  UpdateCustomerDto,
  UpdateCustomerMapper,
} from '@/customer/infrastructure';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly addCreditToCustomerHandler: AddCreditToCustomerHandler,
    private readonly createCustomerHandler: CreateCustomerHandler,
    private readonly deleteCustomerHandler: DeleteCustomerHandler,
    private readonly findCustomerHandler: FindCustomerHandler,
    private readonly findCustomersHandler: FindCustomersHandler,
    private readonly updateteCustomerHandler: UpdateCustomerHandler,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create Customer',
    description: 'Create a new customer based on the provided data.',
    tags: ['Customers'],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              firstName: {
                type: 'string',
                example: 'Jhon',
              },
              lastName: {
                type: 'string',
                example: 'Doe',
              },
              email: {
                type: 'string',
                example: 'user@example.com',
              },
              phone: {
                type: 'string',
                example: '+1234567890',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    example: {
      id: 'hhywyw72gdgdgdgw6gd',
      firstName: 'Jhon',
      lastName: 'Doe',
      email: 'user@example.com',
      credit: 1000,
      phone: '+1234567890',
      createdAt: '2023-09-24T10:30:00Z',
      updatedAt: '2023-09-24T10:30:00Z',
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  create(@Body() dto: CreateCustomerDto) {
    return this.createCustomerHandler.execute(
      CreateCustomerMapper.fromDto(dto),
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update Customer',
    description: 'Update a new customer based on the provided data.',
    tags: ['Customers'],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              firstName: {
                type: 'string',
                example: 'Jhon',
              },
              lastName: {
                type: 'string',
                example: 'Doe',
              },
              email: {
                type: 'string',
                example: 'user@example.com',
              },
              phone: {
                type: 'string',
                example: '+1234567890',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully updated.',
    example: {
      id: 'hhywyw72gdgdgdgw6gd',
      firstName: 'Jhon',
      lastName: 'Doe',
      email: 'user@example.com',
      credit: 1000,
      phone: '+1234567890',
      createdAt: '2023-09-24T10:30:00Z',
      updatedAt: '2023-09-24T10:30:00Z',
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  update(@Body() dto: UpdateCustomerDto, @Param('id') id: string) {
    return this.updateteCustomerHandler.execute(
      UpdateCustomerMapper.fromDto(id, dto),
    );
  }

  @Post(':id/add-credit')
  @ApiOperation({
    summary: 'Add credit to customer',
    description: 'Add credit to customer based on the provided data.',
    tags: ['Customers'],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            required: ['credit'],
            type: 'object',
            properties: {
              credit: {
                type: 'number',
                example: 1000,
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The credit has been successfully added.',
    example: {
      id: 'hhywyw72gdgdgdgw6gd',
      firstName: 'Jhon',
      lastName: 'Doe',
      email: 'user@example.com',
      credit: 1000,
      phone: '+1234567890',
      createdAt: '2023-09-24T10:30:00Z',
      updatedAt: '2023-09-24T10:30:00Z',
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  addCreditcreate(
    @Body() dto: AddCreditToCustomerCustomerDto,
    @Param('id') id: string,
  ) {
    return this.addCreditToCustomerHandler.execute(
      new AddCreditToCustomerCommand(id, dto.credit),
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all customers',
    description: 'Returns customers with optional filters.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of customers returned successfully.',
    example: {
      data: [
        {
          id: 'b89090d7-4bea-4bd2-98d6-5a869db0dbe8',
          firstName: 'Jhon',
          lastName: 'Doe',
          email: 'user@example.com',
          credit: 0,
          phone: '+1234567890',
          createdAt: '2025-03-29T20:52:14.124Z',
          updatedAt: '2025-03-29T20:52:14.124Z',
        },
      ],
      total: 1,
      limit: 10,
      page: 1,
      totalPages: 1,
    },
  })
  @ApiQuery({ name: 'firstName', required: false, type: String })
  @ApiQuery({ name: 'lastName', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'phone', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['credit', 'createdAt'],
  })
  @ApiQuery({
    name: 'sortDirection',
    required: false,
    enum: ['asc', 'desc'],
  })
  findAll(@Query() filter: FindCustomersQuery) {
    return this.findCustomersHandler.execute(filter);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one customer',
    description: 'Returns one customer based on the provided id.',
  })
  @ApiResponse({
    status: 200,
    description: 'The customer has been returned successfully.',
    example: {
      id: 'b89090d7-4bea-4bd2-98d6-5a869db0dbe8',
      firstName: 'Jhon',
      lastName: 'Doe',
      email: 'user@example.com',
      credit: 0,
      phone: '+1234567890',
      createdAt: '2025-03-29T20:52:14.124Z',
      updatedAt: '2025-03-29T20:52:14.124Z',
    },
  })
  fondOne(@Param('id') id: string) {
    return this.findCustomerHandler.execute(new FindCustomerQuery(id));
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete customer',
    description: 'Delete customer based on the provided data.',
    tags: ['Customers'],
  })
  @ApiResponse({
    status: 200,
    description: 'The customer has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  delete(@Param('id') id: string) {
    return this.deleteCustomerHandler.execute(new DeleteCustomerCommand(id));
  }
}
