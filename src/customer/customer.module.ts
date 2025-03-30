import { Module } from '@nestjs/common';
import {
  AddCreditToCustomerHandler,
  CreateCustomerHandler,
  DeleteCustomerHandler,
  FindCustomerHandler,
  FindCustomersHandler,
  UpdateCustomerHandler,
} from '@/customer/application';
import { CustomerRepositoryPort } from '@/customer/domain';
import {
  CustomerController,
  PrismaCustomerRepository,
} from '@/customer/infrastructure';

@Module({
  controllers: [CustomerController],
  providers: [
    AddCreditToCustomerHandler,
    CreateCustomerHandler,
    DeleteCustomerHandler,
    FindCustomerHandler,
    FindCustomersHandler,
    UpdateCustomerHandler,
    {
      provide: CustomerRepositoryPort,
      useClass: PrismaCustomerRepository,
    },
  ],
})
export class CustomerModule {}
