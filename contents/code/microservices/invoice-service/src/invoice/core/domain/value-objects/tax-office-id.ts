import { DomainValueObject } from '@vuvannghia/common';

export class TaxOfficeId extends DomainValueObject {
  constructor(readonly value: string) {
    super(value);
  }
}
