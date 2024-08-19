import { ICommand } from '@nestjs/cqrs';

export class CreateNewInvoiceItemCommand implements ICommand {
  constructor(
    public readonly productId: string,
    public readonly quantity: string,
    public readonly price: string,
    public readonly taxRate: string,
  ) {}
}

export class CreateNewInvoiceCommand implements ICommand {
  constructor(
    public readonly sellerId: string,
    public readonly buyerId: string,

    readonly invoiceItems: CreateNewInvoiceItemCommand[],

    public readonly usbToken: string,
  ) {}
}
