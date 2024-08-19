import { DomainValueObject } from '@vuvannghia/common';
import { TaxPayerException } from '../exceptions/tax-payer.exception';

export class PhoneNumber extends DomainValueObject {
  constructor(readonly value: string) {
    super(value);
    this.validate();
  }

  validate() {
    const regex =
      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

    if (!regex.test(this.value)) {
      throw new TaxPayerException('Số điện thoại không đúng định dạng.');
    }
  }
}
