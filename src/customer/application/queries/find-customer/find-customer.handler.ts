import { Injectable } from '@nestjs/common';
import { CustomerRepositoryPort, UUID } from '@/customer/domain';
import { FindCustomerQuery } from './find-customer.query';

@Injectable()
export class FindCustomerHandler {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async execute({ id }: FindCustomerQuery) {
    const users = await this.customerRepository.findOne(UUID.create(id));

    return users.toJson();
  }
}
