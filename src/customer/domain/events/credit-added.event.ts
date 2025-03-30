import { UUID } from '@/customer/domain';
import { DomainEvent } from '@/shared/domain';

export class CreditAddedEvent implements DomainEvent {
  constructor(
    public readonly customerId: string,
    public readonly amount: number,
    public readonly newTotalCredit: number,
    public readonly occurredAt: Date = new Date(),
    public readonly aggregateId: string = UUID.create().getValue(),
  ) {}
}
