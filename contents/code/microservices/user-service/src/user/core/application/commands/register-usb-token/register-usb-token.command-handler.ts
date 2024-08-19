import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUsbTokenCommand } from './register-usb-token.command';

import { TaxPayerActivatedEvent } from '../../../domain/events/tax-payer-activated.event';
import { TaxPayerException } from '../../../domain/exceptions/tax-payer.exception';
import { UsbTokenAuthenticationService } from '../../../domain/services/usb-token-authentication.service';
import { TaxCode } from '../../../domain/value-objects/tax-code';
import { TaxPayerRepositoryPort } from '../../ports/dataaccess/repositories/tax-payer.repository.port';

@CommandHandler(RegisterUsbTokenCommand)
export class RegisterUsbTokenCommandHandler
  implements ICommandHandler<RegisterUsbTokenCommand>
{
  constructor(
    private readonly UsbTokenAuthenticationService: UsbTokenAuthenticationService,
    private readonly TaxPayerRepository: TaxPayerRepositoryPort,
    private readonly eventBus: EventBus,
  ) {}

  private readonly logger = new Logger(RegisterUsbTokenCommandHandler.name);

  public async execute(payload: RegisterUsbTokenCommand) {
    try {
      this.logger.log(`> payload: ${JSON.stringify(payload)}`);

      const { usbToken, qrCode } =
        await this.UsbTokenAuthenticationService.generate(
          new TaxCode(payload.taxCode),
        );

      const findTaxPayer = await this.TaxPayerRepository.getOneById(
        new TaxCode(payload.taxCode),
      );
      if (!findTaxPayer) {
        throw new TaxPayerException('Người nộp thuế không tồn tại.');
      }

      findTaxPayer.registerUsbToken(usbToken);

      await this.TaxPayerRepository.save(findTaxPayer);

      this.eventBus.publish(
        new TaxPayerActivatedEvent(new TaxCode(payload.taxCode), usbToken),
      );

      return qrCode;
    } catch (error) {
      this.logger.error(`> ${error}`);
      return { message: error.message };
    }
  }
}
