import { IQuery } from '@nestjs/cqrs';

export class FindOneProductQuery implements IQuery {
  constructor(
    public readonly productId: string,
    public readonly taxPayerId: string,
    public readonly usbToken: string,
  ) {}
}
