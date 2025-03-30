import { IsUUID } from 'class-validator';

export class FindCustomerQuery {
  @IsUUID()
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}
