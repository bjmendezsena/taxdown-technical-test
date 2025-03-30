import { SortDirection } from '@/customer/domain';
import { IsOptional, IsString, IsIn, IsNumber } from 'class-validator';

export class FindCustomersQuery {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'credit' | 'createdAt';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortDirection?: SortDirection;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  page?: number;
}
