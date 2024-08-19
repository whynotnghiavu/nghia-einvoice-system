import { ICommand } from '@nestjs/cqrs';

import { Address } from '../../../domain/entities/address';
import { BankDetail } from '../../../domain/entities/bank-detail';
import { TaxPayer } from '../../../domain/entities/tax-payer';

export class TaxPayerRegisteredEventCommand implements ICommand {
  constructor(
    public readonly newAddress: Address,
    public readonly newBankDetail: BankDetail,
    public readonly newTaxPayer: TaxPayer,
  ) {}
}
