import { TaxPayer } from '../../../core/domain/entities/tax-payer';

export class TaxPayerUpdatedEventDto {
  constructor(public readonly TaxPayer: TaxPayer) {}
}
