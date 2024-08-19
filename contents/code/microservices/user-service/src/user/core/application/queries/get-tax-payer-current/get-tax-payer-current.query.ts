import { IQuery } from '@nestjs/cqrs';

export class GetTaxPayerCurrentQuery implements IQuery {
  constructor(public readonly taxCode: string) {}
}
