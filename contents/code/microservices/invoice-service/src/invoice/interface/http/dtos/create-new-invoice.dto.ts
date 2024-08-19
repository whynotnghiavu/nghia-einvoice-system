export class InvoiceItemDto {
  readonly productId: string;
  readonly quantity: string;
  readonly price: string;
  readonly taxRate: string;
}
export class CreateNewInvoiceDto {
  readonly sellerId: string;
  readonly buyerId: string;

  readonly invoiceItems: InvoiceItemDto[];

  readonly usbToken: string;
}
