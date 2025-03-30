import { DomainEvent } from '@/shared/domain';
import { UUID } from '@/customer/domain/model';

export class CustomerCreatedEvent implements DomainEvent {
  constructor(
    public readonly customerId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly occurredAt: Date = new Date(),
    public readonly aggregateId: string = UUID.create().getValue(),
  ) {}
}
