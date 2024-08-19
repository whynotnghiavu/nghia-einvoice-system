import { TaxPayer } from '../entities/tax-payer';
export class TaxPayerDeletedEvent {
  constructor(public readonly TaxPayer: TaxPayer) {}
}
