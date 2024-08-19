import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TaxPayerRegisteredEvent } from '../../domain/events/tax-payer-registered.event';
import { EncryptionEmailService } from '../../domain/services/encryption-email.service';
import { MailerPort } from '../ports/mailer/mailer.port';
import { MessageQueuePort } from '../ports/publisher/message-queue.port';

@EventsHandler(TaxPayerRegisteredEvent)
export class TaxPayerRegisteredEventHandler
  implements IEventHandler<TaxPayerRegisteredEvent>
{
  private readonly logger = new Logger(TaxPayerRegisteredEventHandler.name);

  constructor(
    private readonly EncryptionEmailService: EncryptionEmailService,
    private readonly mailerPort: MailerPort,
    private readonly MessageQueuePort: MessageQueuePort,
  ) {}

  handle(event: TaxPayerRegisteredEvent) {
    try {
      this.logger.debug(`> event: ${JSON.stringify(event)}`);

      const tokenEmail = this.EncryptionEmailService.encrypt(
        event.newTaxPayer.email.value,
        process.env.VERIFY_EMAIL_SECRET,
      );

      this.mailerPort.send(
        event.newTaxPayer.email,
        'Xác thực email',
        'tax-payer-registered.hbs',
        {
          name: event.newTaxPayer.name,
          taxCode: event.newTaxPayer.taxCode.value,
          url: `${process.env.APP_DOMAIN}:${process.env.APP_PORT}/api/user/verify-email/${tokenEmail}`,
        },
      );

      this.logger.log(
        `> Gửi email: ${JSON.stringify(event.newTaxPayer.email.value)}`,
      );

      this.MessageQueuePort.sendMessage('tax-payer-registered', event);
      this.logger.log(`> Gửi sự kiện: ${JSON.stringify(event)}`);
    } catch (error) {
      return { message: error.message };
    }
  }
}
