import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TaxPayerDeletedEvent } from '../../domain/events/tax-payer-deleted.event';
import { MessageQueuePort } from '../ports/publisher/message-queue.port';

@EventsHandler(TaxPayerDeletedEvent)
export class TaxPayerDeletedEventHandler
  implements IEventHandler<TaxPayerDeletedEvent>
{
  private readonly logger = new Logger(TaxPayerDeletedEventHandler.name);

  constructor(private readonly MessageQueuePort: MessageQueuePort) {}

  handle(event: TaxPayerDeletedEvent) {
    try {
      this.logger.debug(`> event: ${JSON.stringify(event)}`);

      this.MessageQueuePort.sendMessage('tax-payer-deleted', {
        taxCode: event.TaxPayer.taxCode.value,
      });
      this.logger.log(
        `> Gửi sự kiện: ${JSON.stringify({
          taxCode: event.TaxPayer.taxCode.value,
        })}`,
      );
    } catch (error) {
      return { message: error.message };
    }
  }
}
