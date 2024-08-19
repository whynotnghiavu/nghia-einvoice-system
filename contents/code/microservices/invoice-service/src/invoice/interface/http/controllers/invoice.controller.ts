import {
  Controller
} from '@nestjs/common';

import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  MessagePattern,
  Payload
} from '@nestjs/microservices';

import { FindTaxPayerQuery } from '../../../core/application/queries/find-tax-payer/find-tax-payer.query';
import { FindTaxPayerDto } from '../dtos/find-tax-payer.dto';

import {
  CreateNewInvoiceCommand,
  CreateNewInvoiceItemCommand,
} from '../../../core/application/commands/create-new-invoice/create-new-invoice.command';
import { FindOneInvoiceQuery } from '../../../core/application/queries/find-one-invoice/find-one-invoice.query';
import { CreateNewInvoiceDto } from '../dtos/create-new-invoice.dto';
import { FindOneInvoiceDto } from '../dtos/find-one-invoice.dto';

@Controller()
export class InvoiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern({ cmd: 'find-tax-payer' })
  async findTaxPayer(@Payload() FindTaxPayerDto: FindTaxPayerDto) {
    return await this.queryBus.execute(
      new FindTaxPayerQuery(FindTaxPayerDto.taxCode),
    );
  }

  @MessagePattern({ cmd: 'create-new-invoice' })
  async createNewInvoice(@Payload() createNewInvoiceDto: CreateNewInvoiceDto) {
    return await this.commandBus.execute(
      new CreateNewInvoiceCommand(
        createNewInvoiceDto.sellerId,
        createNewInvoiceDto.buyerId,

        createNewInvoiceDto.invoiceItems.map((item) => {
          return new CreateNewInvoiceItemCommand(
            item.productId,
            item.quantity,
            item.price,
            item.taxRate,
          );
        }),

        createNewInvoiceDto.usbToken,
      ),
    );
  }

  @MessagePattern({ cmd: 'find-one-invoice' })
  async findOneInvoice(@Payload() findOneInvoiceDto: FindOneInvoiceDto) {
    return await this.queryBus.execute(
      new FindOneInvoiceQuery(
        findOneInvoiceDto.invoiceId,
        findOneInvoiceDto.taxPayerId,
        findOneInvoiceDto.usbToken,
      ),
    );
  }
}
