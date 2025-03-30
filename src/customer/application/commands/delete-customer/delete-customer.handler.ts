import { Injectable } from '@nestjs/common';
import { EventPublisherPort } from '@/shared/domain';
import { CustomerRepositoryPort, UUID } from '@/customer/domain';
import { DeleteCustomerCommand } from './delete-customer.command';

@Injectable()
export class DeleteCustomerHandler {
  constructor(
    private readonly customerRepository: CustomerRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute({ id }: DeleteCustomerCommand) {
    const customer = await this.customerRepository.findOne(UUID.create(id));

    customer.delete();

    await this.customerRepository.delete(customer.id);

    await this.eventPublisher.publish(customer.pullEvents());
  }
}
