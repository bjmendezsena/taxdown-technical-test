import { Injectable } from '@nestjs/common';
import { EventPublisherPort } from '@/shared/domain';
import { Customer, CustomerRepositoryPort } from '@/customer/domain';
import { CreateCustomerCommand } from './create-customer.command';

@Injectable()
export class CreateCustomerHandler {
  constructor(
    private readonly customerRepository: CustomerRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(command: CreateCustomerCommand) {
    const customer = Customer.create(command);

    const newCustomer = await this.customerRepository.create(customer);
    await this.eventPublisher.publish(customer.pullEvents());
    return newCustomer.toJson();
  }
}
