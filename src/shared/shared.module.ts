import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventPublisherPort } from '@/shared/domain';
import { MongoEventPublisher, EventSchema } from '@/shared/infrastructure';
import { PrismaService } from '@/shared/infrastructure/db/prisma/prisma.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
  ],
  providers: [
    PrismaService,
    {
      provide: EventPublisherPort,
      useClass: MongoEventPublisher,
    },
  ],
  exports: [EventPublisherPort, PrismaService],
})
export class SharedModule {}
