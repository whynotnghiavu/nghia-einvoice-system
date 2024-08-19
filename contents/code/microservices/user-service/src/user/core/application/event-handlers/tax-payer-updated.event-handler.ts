import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TaxPayerUpdatedEvent } from '../../domain/events/tax-payer-updated.event';
import { MessageQueuePort } from '../ports/publisher/message-queue.port';

@EventsHandler(TaxPayerUpdatedEvent)
export class TaxPayerUpdatedEventHandler
  implements IEventHandler<TaxPayerUpdatedEvent>
{
  private readonly logger = new Logger(TaxPayerUpdatedEventHandler.name);

  constructor(private readonly MessageQueuePort: MessageQueuePort) {}

  handle(event: TaxPayerUpdatedEvent) {
    try {
      this.logger.debug(`> event: ${JSON.stringify(event)}`);

      this.MessageQueuePort.sendMessage('tax-payer-updated', event);
      this.logger.log(`> Gửi sự kiện: ${JSON.stringify(event)}`);
    } catch (error) {
      return { message: error.message };
    }
  }
}
