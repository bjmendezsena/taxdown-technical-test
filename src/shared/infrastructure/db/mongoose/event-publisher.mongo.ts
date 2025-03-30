import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DomainEvent, EventPublisherPort } from '@/shared/domain';
import { Event } from '@/shared/infrastructure/db/mongoose/schemas';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MongoEventPublisher implements EventPublisherPort {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async publish(events: DomainEvent[]): Promise<void> {
    const eventDocs = events.map((event: DomainEvent) => ({
      type: event.constructor.name,
      aggregateId: event.aggregateId,
      payload: {
        ...event,
        aggregateId: undefined,
        occurredAt: undefined,
      },
      occurredAt: event.occurredAt,
    }));

    await this.eventModel.insertMany(eventDocs);
  }
}
