import { ICommand } from '@nestjs/cqrs';

export class UpdateTaxPayerCommand implements ICommand {
  constructor(
    public readonly taxCode: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly usbToken: string,
  ) {}
}
