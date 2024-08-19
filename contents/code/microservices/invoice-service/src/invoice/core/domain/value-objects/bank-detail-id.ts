import { DomainValueObject } from '@vuvannghia/common';

export class BankDetailId extends DomainValueObject {
  constructor(readonly value: string) {
    super(value);
  }
}
