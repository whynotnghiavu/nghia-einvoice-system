import { ICommand } from '@nestjs/cqrs';

export class TaxPayerActivatedEventCommand implements ICommand {
  constructor(
    public readonly taxCode: string,
    public readonly usbToken: string,
  ) {}
}
