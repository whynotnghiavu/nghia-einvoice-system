import { ICommand } from '@nestjs/cqrs';

export class DeleteProductCommand implements ICommand {
  constructor(
    public readonly productId: string,
    public readonly taxPayerId: string,
    public readonly usbToken: string,
  ) {}
}
