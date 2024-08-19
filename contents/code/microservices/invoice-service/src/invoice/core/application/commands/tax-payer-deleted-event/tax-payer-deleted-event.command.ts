import { ICommand } from '@nestjs/cqrs';

export class TaxPayerDeletedEventCommand implements ICommand {
  constructor(public readonly taxCode: string) {}
}
