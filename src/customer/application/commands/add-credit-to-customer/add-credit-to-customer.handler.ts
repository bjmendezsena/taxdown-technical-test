import { Injectable } from '@nestjs/common';
import { EventPublisherPort } from '@/shared/domain';
import { CustomerRepositoryPort, UUID } from '@/customer/domain';
import { AddCreditToCustomerCommand } from './add-credit-to-customer.command';

@Injectable()
export class AddCreditToCustomerHandler {
  constructor(
    private readonly customerRepository: CustomerRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute({ id, credit }: AddCreditToCustomerCommand) {
    const customer = await this.customerRepository.findOne(UUID.create(id));

    customer.addCredit(credit);
    customer.validateCredit();

    const updatedCustomer = await this.customerRepository.update(customer);

    await this.eventPublisher.publish(customer.pullEvents());

    return updatedCustomer.toJson();
  }
}
