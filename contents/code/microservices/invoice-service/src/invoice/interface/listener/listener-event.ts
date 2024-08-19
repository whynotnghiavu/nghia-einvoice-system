import { Controller, Logger } from '@nestjs/common';

import { EventPattern, Payload } from '@nestjs/microservices';

import { CommandBus } from '@nestjs/cqrs';

import { TaxPayerRegisteredEventCommand } from '../../core/application/commands/tax-payer-registered-event/tax-payer-registered-event.command';
import { TaxPayerRegisteredEventDto } from './dtos/tax-payer-registered.event.dto';

import { TaxPayerActivatedEventCommand } from '../../core/application/commands/tax-payer-activated-event/tax-payer-activated-event.command';
import { TaxPayerActivatedEventDto } from './dtos/tax-payer-activated.event.dto';

import { TaxPayerUpdatedEventCommand } from '../../core/application/commands/tax-payer-updated-event/tax-payer-updated-event.command';
import { TaxPayerUpdatedEventDto } from './dtos/tax-payer-updated.event.dto';

import { TaxPayerDeletedEventCommand } from '../../core/application/commands/tax-payer-deleted-event/tax-payer-deleted-event.command';
import { TaxPayerDeletedEventDto } from './dtos/tax-payer-deleted.event.dto';

@Controller()
export class ListenerEvent {
  private readonly logger = new Logger(ListenerEvent.name);
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('tax-payer-registered')
  async TaxPayerRegisteredEvent(@Payload() event: TaxPayerRegisteredEventDto) {
    this.logger.debug(`> Event: ${JSON.stringify(event)}`);
    await this.commandBus.execute(
      new TaxPayerRegisteredEventCommand(
        event.newAddress,
        event.newBankDetail,
        event.newTaxPayer,
      ),
    );
  }

  @EventPattern('tax-payer-activated')
  async TaxPayerActivatedEvent(@Payload() event: TaxPayerActivatedEventDto) {
    this.logger.debug(`> Event: ${JSON.stringify(event)}`);
    await this.commandBus.execute(
      new TaxPayerActivatedEventCommand(event.taxCode, event.usbToken),
    );
  }

  @EventPattern('tax-payer-updated')
  async TaxPayerUpdatedEvent(@Payload() event: TaxPayerUpdatedEventDto) {
    this.logger.debug(`> Event: ${JSON.stringify(event)}`);
    await this.commandBus.execute(
      new TaxPayerUpdatedEventCommand(event.TaxPayer),
    );
  }

  @EventPattern('tax-payer-deleted')
  async TaxPayerDeletedEvent(@Payload() event: TaxPayerDeletedEventDto) {
    this.logger.debug(`> Event: ${JSON.stringify(event)}`);
    await this.commandBus.execute(
      new TaxPayerDeletedEventCommand(event.taxCode),
    );
  }
}
