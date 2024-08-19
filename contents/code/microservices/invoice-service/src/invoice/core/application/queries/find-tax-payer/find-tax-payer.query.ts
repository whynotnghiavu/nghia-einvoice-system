import { IQuery } from '@nestjs/cqrs';

export class FindTaxPayerQuery implements IQuery {
  constructor(public readonly taxCode: string) {}
}
