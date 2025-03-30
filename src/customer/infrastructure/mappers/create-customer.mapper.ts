import { CreateCustomerDto } from '@/customer/infrastructure';
import { CreateCustomerCommand } from '@/customer/application';

export class CreateCustomerMapper {
  static fromDto(dto: CreateCustomerDto): CreateCustomerCommand {
    return new CreateCustomerCommand(
      dto.firstName,
      dto.lastName,
      dto.email,
      dto.phone,
    );
  }
}
