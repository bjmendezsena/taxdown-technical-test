import { UpdateCustomerDto } from '@/customer/infrastructure';
import { UpdateCustomerCommand } from '@/customer/application';

export class UpdateCustomerMapper {
  static fromDto(id: string, dto: UpdateCustomerDto): UpdateCustomerCommand {
    return new UpdateCustomerCommand(
      id,
      dto.firstName,
      dto.lastName,
      dto.email,
      dto.phone,
    );
  }
}
