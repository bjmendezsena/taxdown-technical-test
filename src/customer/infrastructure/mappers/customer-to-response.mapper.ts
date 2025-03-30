import { Customer } from '@/customer/domain';

export class CustomerToResponseMapper {
  static map(customer: Customer) {
    return customer.toJson();
  }

  static mapArray(customers: Customer[]) {
    return customers.map(this.map);
  }
}
