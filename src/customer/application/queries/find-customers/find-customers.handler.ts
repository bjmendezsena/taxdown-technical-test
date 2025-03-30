import { Injectable } from '@nestjs/common';
import { CustomerToResponseMapper } from '@/customer/infrastructure/mappers';
import { CustomerRepositoryPort } from '@/customer/domain';
import { FindCustomersQuery } from './find-customers.query';

@Injectable()
export class FindCustomersHandler {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async execute(filter: FindCustomersQuery) {
    const users = await this.customerRepository.findAll(filter);
    const { limit = 10, page = 1 } = filter || {};

    const count = await this.customerRepository.getCount();

    const totalPages = Math.ceil(count / limit);

    return {
      data: CustomerToResponseMapper.mapArray(users),
      total: count,
      limit,
      page,
      totalPages,
    };
  }
}
