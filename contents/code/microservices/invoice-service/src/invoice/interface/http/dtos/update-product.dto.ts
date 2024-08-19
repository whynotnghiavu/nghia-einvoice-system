export class UpdateProductDto {
  readonly productId: string;
  readonly name?: string;
  readonly unit?: string;
  readonly price?: number;
  readonly description?: string;
  readonly taxRate?: string;
  readonly taxPayerId: string;
  readonly usbToken: string;
}
