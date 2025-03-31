import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsNotEmpty, IsDefined } from 'class-validator';

export class AddCreditToCustomerCustomerDto {
  @ApiProperty({
    example: '1000',
    description: 'The credit of the user',
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsDefined()
  credit: number;
}
