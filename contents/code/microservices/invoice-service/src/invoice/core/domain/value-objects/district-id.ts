import { DomainValueObject } from '@vuvannghia/common';

export class DistrictId extends DomainValueObject {
  constructor(readonly value: string) {
    super(value);
  }
}
