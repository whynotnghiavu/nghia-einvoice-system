import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TaxCode } from '../../../domain/value-objects/tax-code';
import { TaxPayerDeletedEventCommand } from './tax-payer-deleted-event.command';

import { TaxPayerRepositoryPort } from '../../ports/dataaccess/repositories/tax-payer.repository.port';

@CommandHandler(TaxPayerDeletedEventCommand)
export class TaxPayerDeletedEventCommandHandler
  implements ICommandHandler<TaxPayerDeletedEventCommand>
{
  private readonly logger = new Logger(TaxPayerDeletedEventCommandHandler.name);
  constructor(private readonly TaxPayerRepository: TaxPayerRepositoryPort) {}

  public async execute(payload: TaxPayerDeletedEventCommand) {
    try {
      this.logger.log(`> payload: ${JSON.stringify(payload)}`);

      const findTaxPayer = await this.TaxPayerRepository.getOneById(
        new TaxCode(payload.taxCode),
      );

      findTaxPayer.delete();

      await this.TaxPayerRepository.save(findTaxPayer);
    } catch (error) {
      this.logger.error(`> ${error}`);
      return { message: error.message };
    }
  }
}
