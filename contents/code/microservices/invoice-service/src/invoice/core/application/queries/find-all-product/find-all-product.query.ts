import { IQuery } from '@nestjs/cqrs';

export class FindAllProductQuery implements IQuery {
  constructor(
    public readonly taxPayerId: string,
    public readonly usbToken: string,
  ) {}
}
