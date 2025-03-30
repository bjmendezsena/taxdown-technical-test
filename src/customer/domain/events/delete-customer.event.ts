import { UUID } from '@/customer/domain';
import { DomainEvent } from '@/shared/domain';

export class DeleteCustomerEvent implements DomainEvent {
  constructor(
    public readonly customerId: string,
    public readonly occurredAt: Date = new Date(),
    public readonly aggregateId: string = UUID.create().getValue(),
  ) {}
}
