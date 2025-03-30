import { DomainEvent } from '@/shared/domain';

export abstract class EventPublisherPort {
  abstract publish(events: DomainEvent[]): Promise<void>;
}
