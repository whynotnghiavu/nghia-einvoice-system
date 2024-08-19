import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TaxPayerActivatedEvent } from '../../domain/events/tax-payer-activated.event';
import { MessageQueuePort } from '../ports/publisher/message-queue.port';

@EventsHandler(TaxPayerActivatedEvent)
export class TaxPayerActivatedEventHandler
  implements IEventHandler<TaxPayerActivatedEvent>
{
  private readonly logger = new Logger(TaxPayerActivatedEventHandler.name);

  constructor(private readonly MessageQueuePort: MessageQueuePort) {}

  handle(event: TaxPayerActivatedEvent) {
    try {
      this.logger.debug(`> event: ${JSON.stringify(event)}`);

      this.MessageQueuePort.sendMessage('tax-payer-activated', {
        taxCode: event.taxCode.value,
        usbToken: event.usbToken,
      });
      this.logger.log(
        `> Gửi sự kiện: ${JSON.stringify({
          taxCode: event.taxCode.value,
          usbToken: event.usbToken,
        })}`,
      );
    } catch (error) {
      return { message: error.message };
    }
  }
}
