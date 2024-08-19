import { TaxPayer } from '../entities/tax-payer';

export class TaxPayerUpdatedEvent {
  constructor(public readonly TaxPayer: TaxPayer) {}
}
