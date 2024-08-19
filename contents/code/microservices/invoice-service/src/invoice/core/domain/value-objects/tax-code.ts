import { DomainValueObject } from '@vuvannghia/common';

export class TaxCode extends DomainValueObject {
  constructor(readonly value: string) {
    super(value);
  }
}
