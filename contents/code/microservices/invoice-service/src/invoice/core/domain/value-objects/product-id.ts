import { DomainValueObject } from '@vuvannghia/common';

export class ProductId extends DomainValueObject {
  constructor(readonly value: string) {
    super(value);
  }
}
