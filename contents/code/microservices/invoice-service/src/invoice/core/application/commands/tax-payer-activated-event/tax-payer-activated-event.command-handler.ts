import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TaxPayerActivatedEventCommand } from './tax-payer-activated-event.command';

import { TaxCode } from '../../../domain/value-objects/tax-code';
import { TaxPayerRepositoryPort } from '../../ports/dataaccess/repositories/tax-payer.repository.port';

@CommandHandler(TaxPayerActivatedEventCommand)
export class TaxPayerActivatedEventCommandHandler
  implements ICommandHandler<TaxPayerActivatedEventCommand>
{
  private readonly logger = new Logger(
    TaxPayerActivatedEventCommandHandler.name,
  );
  constructor(private readonly TaxPayerRepository: TaxPayerRepositoryPort) {}

  public async execute(payload: TaxPayerActivatedEventCommand) {
    try {
      this.logger.log(`> payload: ${JSON.stringify(payload)}`);

      const findTaxPayer = await this.TaxPayerRepository.getOneById(
        new TaxCode(payload.taxCode),
      );

      findTaxPayer.registerUsbToken(payload.usbToken);

      await this.TaxPayerRepository.save(findTaxPayer);
    } catch (error) {
      this.logger.error(`> ${error}`);
      return { message: error.message };
    }
  }
}
