import { ICommand } from '@nestjs/cqrs';

export class RegisterTaxPayerCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly password: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly taxOfficeId: string,
    public readonly bankId: string,
    public readonly accountBank: string,
    public readonly wardId: string,
    public readonly noteAddress: string,
  ) {}
}
