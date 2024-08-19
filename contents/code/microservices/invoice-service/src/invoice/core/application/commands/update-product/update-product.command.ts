import { ICommand } from '@nestjs/cqrs';

export class UpdateProductCommand implements ICommand {
  constructor(
    public readonly productId: string,

    public readonly name: string,
    public readonly unit: string,
    public readonly price: number,
    public readonly description: string,
    readonly taxRate: string,

    public readonly taxPayerId: string,
    public readonly usbToken: string,
  ) {}
}
