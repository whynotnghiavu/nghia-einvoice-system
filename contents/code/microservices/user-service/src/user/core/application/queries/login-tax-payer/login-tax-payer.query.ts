import { IQuery } from '@nestjs/cqrs';

export class LoginTaxPayerQuery implements IQuery {
  constructor(
    public readonly taxCode: string,
    public readonly password: string,
    public readonly usbToken: string,
  ) {}
}
