import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Event {
  @Prop({ required: true })
  type: string;
  @Prop({ required: true })
  aggregateId: string;

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  payload: any;
  @Prop({ required: true })
  occurredAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);

export type EventDocument = HydratedDocument<Event>;
