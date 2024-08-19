import { TaxCode } from '../value-objects/tax-code';

export class TaxPayerActivatedEvent {
  constructor(
    public readonly taxCode: TaxCode,
    public readonly usbToken: string,
  ) {}
}
