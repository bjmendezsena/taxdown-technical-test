export class CreateCustomerCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone?: string,
  ) {}
}
