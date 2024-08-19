import { DomainException } from '@vuvannghia/common';

export class InvoiceException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
