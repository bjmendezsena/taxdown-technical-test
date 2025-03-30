import { Injectable } from '@nestjs/common';
import { EventPublisherPort } from '@/shared/domain';
import { CustomerRepositoryPort, UUID } from '@/customer/domain';
import { UpdateCustomerCommand } from './update-customer.command';

@Injectable()
export class UpdateCustomerHandler {
  constructor(
    private readonly customerRepository: CustomerRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute({ id, ...command }: UpdateCustomerCommand) {
    const foundCustomer = await this.customerRepository.findOne(
      UUID.create(id),
    );

    const updatedCustomer = foundCustomer.update(command);

    const newCustomer = await this.customerRepository.update(updatedCustomer);
    await this.eventPublisher.publish(updatedCustomer.pullEvents());
    return newCustomer.toJson();
  }
}
