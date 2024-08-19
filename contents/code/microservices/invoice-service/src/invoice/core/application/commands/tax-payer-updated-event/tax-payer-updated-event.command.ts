import { ICommand } from '@nestjs/cqrs';

import { TaxPayer } from '../../../domain/entities/tax-payer';

export class TaxPayerUpdatedEventCommand implements ICommand {
  constructor(public readonly TaxPayer: TaxPayer) {}
}
