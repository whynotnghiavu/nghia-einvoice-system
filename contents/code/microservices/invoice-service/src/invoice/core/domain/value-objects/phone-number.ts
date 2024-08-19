import { DomainValueObject } from '@vuvannghia/common';
import { InvoiceException } from '../exceptions/invoice.exception';

export class PhoneNumber extends DomainValueObject {
  constructor(readonly value: string) {
    super(value);
    this.validate();
  }

  validate() {
    const regex =
      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

    if (!regex.test(this.value)) {
      throw new InvoiceException('Số điện thoại không đúng định dạng.');
    }
  }
}
