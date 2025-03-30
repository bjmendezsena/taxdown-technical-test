import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  UUID,
  CustomerFilter,
  CustomerRepositoryPort,
  Customer,
  CustomerNotFoundException,
  CustomerAlreadyExistsException,
} from '@/customer/domain';
import { PrismaService } from '@/shared/infrastructure';

@Injectable()
export class PrismaCustomerRepository implements CustomerRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}
  async getCount(): Promise<number> {
    return this.prisma.customer.count();
  }

  async findOne(id: UUID): Promise<Customer> {
    const foundCustomer = await this.prisma.customer.findFirst({
      where: { id: id.getValue() },
    });

    if (!foundCustomer) {
      throw new CustomerNotFoundException(id.getValue());
    }

    return Customer.reconstitute({
      email: foundCustomer.email,
      firstName: foundCustomer.firstName,
      id: foundCustomer.id,
      lastName: foundCustomer.lastName,
      createdAt: foundCustomer.createdAt,
      credit: foundCustomer.credit,
      phone: foundCustomer.phone,
      updatedAt: foundCustomer.updatedAt,
    });
  }
  async findAll({
    sortBy = 'createdAt',
    sortDirection = 'asc',
    email,
    firstName,
    lastName,
    phone,
    limit = 10,
    page = 1,
  }: CustomerFilter = {}): Promise<Customer[]> {
    const where: Prisma.CustomerWhereInput = {
      email: {
        contains: email,
        mode: 'insensitive',
      },
      phone,
      firstName: {
        contains: firstName,
        mode: 'insensitive',
      },
      lastName: {
        contains: lastName,
        mode: 'insensitive',
      },
    };

    const foundCustomers = await this.prisma.customer.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where,
      orderBy: {
        [sortBy]: sortDirection,
      },
    });

    return foundCustomers.map((customer) =>
      Customer.reconstitute({
        email: customer.email,
        firstName: customer.firstName,
        id: customer.id,
        lastName: customer.lastName,
        createdAt: customer.createdAt,
        credit: customer.credit,
        phone: customer.phone,
        updatedAt: customer.updatedAt,
      }),
    );
  }
  async create(data: Customer): Promise<Customer> {
    const foundCustomer = await this.prisma.customer.findFirst({
      where: {
        email: data.getEmail(),
      },
    });

    if (foundCustomer) {
      throw new CustomerAlreadyExistsException(data.getEmail());
    }

    const jsonData = data.toRawJson();

    const createdCustomer = await this.prisma.customer.create({
      data: jsonData,
    });

    return Customer.reconstitute({
      email: createdCustomer.email,
      firstName: createdCustomer.firstName,
      id: createdCustomer.id,
      lastName: createdCustomer.lastName,
      createdAt: createdCustomer.createdAt,
      credit: createdCustomer.credit,
      phone: createdCustomer.phone,
      updatedAt: createdCustomer.updatedAt,
    });
  }
  async update(data: Customer): Promise<Customer> {
    const foundCustomer = await this.findOne(data.id);

    const jsonData = data.toRawJson();

    const updatedCustomer = await this.prisma.customer.update({
      where: {
        id: foundCustomer.id.getValue(),
      },
      data: jsonData,
    });

    return Customer.reconstitute({
      email: updatedCustomer.email,
      firstName: updatedCustomer.firstName,
      id: updatedCustomer.id,
      lastName: updatedCustomer.lastName,
      createdAt: updatedCustomer.createdAt,
      credit: updatedCustomer.credit,
      phone: updatedCustomer.phone,
      updatedAt: updatedCustomer.updatedAt,
    });
  }

  async delete(id: UUID): Promise<void> {
    const foundCustomer = await this.findOne(id);

    await this.prisma.customer.delete({
      where: {
        id: foundCustomer.id.getValue(),
      },
    });
  }
}
