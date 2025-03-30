import {
  UpdateCustomerDto,
  UpdateCustomerMapper,
} from '@/customer/infrastructure';
import { UpdateCustomerCommand } from '@/customer/application';
import { fixedUUID } from '@/test/setup';

describe('UpdateCustomerMapper', () => {
  it('should map DTO to command with all fields', () => {
    const dto: UpdateCustomerDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
    };

    const command = UpdateCustomerMapper.fromDto(fixedUUID, dto);

    expect(command).toBeInstanceOf(UpdateCustomerCommand);
    expect(command).toEqual({
      id: fixedUUID,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
    });
  });

  it('should map DTO to command without phone', () => {
    const dto: UpdateCustomerDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    const command = UpdateCustomerMapper.fromDto(fixedUUID, dto);

    expect(command.phone).toBeUndefined();
  });
});
