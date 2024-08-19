import { DomainException } from '@vuvannghia/common';

export class TaxPayerException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
