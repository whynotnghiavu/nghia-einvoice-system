import { DomainException, DomainValueObject } from '@vuvannghia/common';

export class Email extends DomainValueObject {
  constructor(readonly value: string) {
    super(value);
    this.validate();
  }

  validate() {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!regex.test(this.value)) {
      throw new DomainException('Email không đúng định dạng.');
    }
  }
}
