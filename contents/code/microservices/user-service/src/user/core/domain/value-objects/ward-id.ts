import { DomainValueObject } from '@vuvannghia/common';

export class WardId extends DomainValueObject {
  constructor(readonly value: string) {
    super(value);
  }
}
