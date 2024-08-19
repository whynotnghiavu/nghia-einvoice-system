import { DomainValueObject } from '@vuvannghia/common';

export class InvoiceItemId extends DomainValueObject {
  constructor(readonly value: string) {
    super(value);
  }
}
