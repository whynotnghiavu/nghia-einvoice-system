import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TaxPayerUpdatedEventCommand } from './tax-payer-updated-event.command';

import { InvoiceException } from '../../../domain/exceptions/invoice.exception';
import { Email } from '../../../domain/value-objects/email';
import { PhoneNumber } from '../../../domain/value-objects/phone-number';
import { TaxCode } from '../../../domain/value-objects/tax-code';
import { AddressRepositoryPort } from '../../ports/dataaccess/repositories/address.repository.port';
import { BankDetailRepositoryPort } from '../../ports/dataaccess/repositories/bank-detail.repository.port';
import { BankRepositoryPort } from '../../ports/dataaccess/repositories/bank.repository.port';
import { TaxOfficeRepositoryPort } from '../../ports/dataaccess/repositories/tax-office.repository.port';
import { TaxPayerRepositoryPort } from '../../ports/dataaccess/repositories/tax-payer.repository.port';
import { WardRepositoryPort } from '../../ports/dataaccess/repositories/ward.repository.port';

@CommandHandler(TaxPayerUpdatedEventCommand)
export class TaxPayerUpdatedEventCommandHandler
  implements ICommandHandler<TaxPayerUpdatedEventCommand>
{
  constructor(
    private readonly TaxPayerRepository: TaxPayerRepositoryPort,
    private readonly TaxOfficeRepositoryPort: TaxOfficeRepositoryPort,
    private readonly BankRepository: BankRepositoryPort,
    private readonly WardRepository: WardRepositoryPort,
    private readonly BankDetailRepository: BankDetailRepositoryPort,
    private readonly AddressRepository: AddressRepositoryPort,
  ) {}
  private readonly logger = new Logger(TaxPayerUpdatedEventCommandHandler.name);

  public async execute(payload: TaxPayerUpdatedEventCommand) {
    try {
      this.logger.log(`> payload: ${JSON.stringify(payload)}`);
      const findTaxPayer = await this.TaxPayerRepository.getOneById(
        new TaxCode(payload.TaxPayer.taxCode.value),
      );
      if (!findTaxPayer) {
        throw new InvoiceException('Người nộp thuế không tồn tại.');
      }

      findTaxPayer.update(
        payload.TaxPayer.name,
        new Email(payload.TaxPayer.email.value),
        new PhoneNumber(payload.TaxPayer.phoneNumber.value),
      );

      await this.TaxPayerRepository.save(findTaxPayer);
    } catch (error) {
      this.logger.error(`> ${error}`);
      return { message: error.message };
    }
  }
}
