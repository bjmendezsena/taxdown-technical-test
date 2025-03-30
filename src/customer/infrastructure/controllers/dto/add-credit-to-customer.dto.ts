import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddCreditToCustomerCustomerDto {
  @ApiProperty({
    example: '1000',
    description: 'The credit of the user',
    type: Number,
  })
  @IsNumber()
  credit: number;
}
