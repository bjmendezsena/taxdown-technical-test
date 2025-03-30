import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto {
  @ApiProperty({
    example: 'Jhon',
    description: 'First name of the user',
    type: String,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'lastname of the user',
    type: String,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456789',
    description: 'The phone number of the user',
    type: String,
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
