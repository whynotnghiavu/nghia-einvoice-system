import { DomainValueObject } from '@vuvannghia/common';

export class BankId extends DomainValueObject {
  constructor(readonly value: string) {
    super(value);
  }
}
