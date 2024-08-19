import { IQuery } from '@nestjs/cqrs';

export class FindOneInvoiceQuery implements IQuery {
  constructor(
    public readonly invoiceId: string,
    public readonly taxPayerId: string,
    public readonly usbToken: string,
  ) {}
}
