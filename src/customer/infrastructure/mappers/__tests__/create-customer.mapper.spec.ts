import {
  CreateCustomerDto,
  CreateCustomerMapper,
} from '@/customer/infrastructure';
import { CreateCustomerCommand } from '@/customer/application';

describe('CreateCustomerMapper', () => {
  it('should map DTO to command with all fields', () => {
    const dto: CreateCustomerDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
    };

    const command = CreateCustomerMapper.fromDto(dto);

    expect(command).toBeInstanceOf(CreateCustomerCommand);
    expect(command).toEqual({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
    });
  });

  it('should map DTO to command without phone', () => {
    const dto: CreateCustomerDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    const command = CreateCustomerMapper.fromDto(dto);

    expect(command.phone).toBeUndefined();
  });
});
