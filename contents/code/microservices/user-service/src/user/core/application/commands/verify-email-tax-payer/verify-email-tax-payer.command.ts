import { ICommand } from '@nestjs/cqrs';

export class VerifyEmailTaxPayerCommand implements ICommand {
  constructor(public readonly tokenEmail: string) {}
}
