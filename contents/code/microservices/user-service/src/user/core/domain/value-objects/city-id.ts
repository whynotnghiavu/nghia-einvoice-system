import { DomainValueObject } from '@vuvannghia/common';

export class CityId extends DomainValueObject {
  constructor(readonly value: string) {
    super(value);
  }
}
