import { TaxOfficeId } from '../value-objects/tax-office-id';

export class TaxOffice {
  taxOfficeId: TaxOfficeId;
  name: string;

  constructor(taxOfficeId: TaxOfficeId) {
    this.taxOfficeId = taxOfficeId;
  }
}
