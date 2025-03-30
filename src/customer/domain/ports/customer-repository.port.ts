import { Customer, UUID, CustomerFilter } from '@/customer/domain';

export abstract class CustomerRepositoryPort {
  abstract findOne(id: UUID): Promise<Customer>;
  abstract findAll(filters?: CustomerFilter): Promise<Customer[]>;
  abstract create(data: Customer): Promise<Customer>;
  abstract update(data: Customer): Promise<Customer>;
  abstract delete(id: UUID): Promise<void>;
  abstract getCount(): Promise<number>;
}
