import { ICommand } from '@nestjs/cqrs';

export class CreateProductCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly unit: string,
    public readonly price: number,
    public readonly description: string,
    public readonly taxRate: number,
    public readonly taxPayerId: string,
    public readonly usbToken: string,
  ) {}
}
