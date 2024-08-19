import { DomainValueObject } from '@vuvannghia/common';

export class InvoiceId extends DomainValueObject {
  constructor(readonly value: string) {
    super(value);
  }
}
