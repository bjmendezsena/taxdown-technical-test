import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CustomerModule } from '@/customer/customer.module';
import { SharedModule } from '@/shared/shared.module';
import { envs } from 'config';

@Module({
  imports: [
    MongooseModule.forRoot(envs.MONGODB_URI),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => envs],
    }),
    SharedModule,
    CustomerModule,
  ],
})
export class AppModule {}
