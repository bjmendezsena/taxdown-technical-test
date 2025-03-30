export class AddCreditToCustomerCommand {
  constructor(
    public readonly id: string,
    public readonly credit: number,
  ) {}
}
