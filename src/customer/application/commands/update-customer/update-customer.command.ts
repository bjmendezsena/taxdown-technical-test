export class UpdateCustomerCommand {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone?: string,
  ) {}
}
