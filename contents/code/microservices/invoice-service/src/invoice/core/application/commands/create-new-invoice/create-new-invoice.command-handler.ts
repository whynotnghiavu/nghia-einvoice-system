import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateNewInvoiceCommand } from './create-new-invoice.command';

import { InvoiceException } from '../../../domain/exceptions/invoice.exception';
import { InvoiceRepositoryPort } from '../../ports/dataaccess/repositories/invoice.repository.port';
import { ProductRepositoryPort } from '../../ports/dataaccess/repositories/product.repository.port';
import { TaxPayerRepositoryPort } from '../../ports/dataaccess/repositories/tax-payer.repository.port';

import { UsbTokenAuthenticationService } from '../../../domain/services/usb-token-authentication.service';

import { randomUUID } from 'crypto';
import { Invoice } from '../../../domain/entities/invoice';
import { InvoiceItem } from '../../../domain/entities/invoice-item';
import { InvoiceCreatedEvent } from '../../../domain/events/invoice-created.event';
import { InvoiceId } from '../../../domain/value-objects/invoice-id';
import { Money } from '../../../domain/value-objects/money';
import { ProductId } from '../../../domain/value-objects/product-id';
import { TaxCode } from '../../../domain/value-objects/tax-code';
import { MicroservicesTctPort } from '../../ports/tct/tct.port';

@CommandHandler(CreateNewInvoiceCommand)
export class CreateNewInvoiceCommandHandler
  implements ICommandHandler<CreateNewInvoiceCommand>
{
  constructor(
    private readonly MicroservicesTctPort: MicroservicesTctPort,
    private readonly ProductRepository: ProductRepositoryPort,
    private readonly TaxPayerRepository: TaxPayerRepositoryPort,
    private readonly UsbTokenAuthenticationService: UsbTokenAuthenticationService,
    private readonly InvoiceRepositoryPort: InvoiceRepositoryPort,
    private readonly eventBus: EventBus,
  ) {}

  private readonly logger = new Logger(CreateNewInvoiceCommandHandler.name);

  public async execute(payload: CreateNewInvoiceCommand) {
    try {
      this.logger.log(`> payload: ${JSON.stringify(payload)}`);

      const findSeller = await this.TaxPayerRepository.getOneById(
        new TaxCode(payload.sellerId),
      );
      if (!findSeller) {
        throw new InvoiceException('Người bán không tồn tại.');
      }

      const isValidUsbToken = await this.UsbTokenAuthenticationService.verify(
        payload.usbToken,
        findSeller.usbToken,
      );

      if (!isValidUsbToken) {
        throw new InvoiceException('Chữ ký số không đúng.');
      }

      const findBuyer = await this.TaxPayerRepository.getOneById(
        new TaxCode(payload.buyerId),
      );
      if (!findBuyer) {
        throw new InvoiceException('Người mua không tồn tại.');
      }

      for (const item of payload.invoiceItems) {
        const findProduct = await this.ProductRepository.getOneById(
          new ProductId(item.productId),
        );
        if (!findProduct) {
          throw new InvoiceException('Sản phẩm không tồn tại.');
        }
        if (findProduct.taxRate !== Number(item.taxRate)) {
          throw new InvoiceException('Thuế suất không đúng.');
        }

        if (findProduct.price.value !== new Money(Number(item.price)).value) {
          throw new InvoiceException('Giá bán không đúng.');
        }
      }

      const newInvoiceId = await this.MicroservicesTctPort.getId();
      if (!newInvoiceId) {
        throw new InvoiceException('Lỗi hóa đơn không được phê duyệt.');
      }

      const newInvoiceItems = payload.invoiceItems.map((item) => {
        return InvoiceItem.Builder(new InvoiceId(randomUUID()))
          .withProductId(new ProductId(item.productId))
          .withQuantity(Number(item.quantity))
          .withPrice(new Money(Number(item.price)))
          .withTaxRate(Number(item.taxRate))
          .build();
      });

      const newInvoice = Invoice.Builder(new InvoiceId(newInvoiceId))
        .withSellerId(new TaxCode(payload.sellerId))
        .withBuyerId(new TaxCode(payload.buyerId))
        .withItem(newInvoiceItems)
        .withCreateAt(new Date())
        .build();

      this.InvoiceRepositoryPort.save(newInvoice);

      this.eventBus.publish(new InvoiceCreatedEvent(newInvoice));

      return newInvoice;
    } catch (error) {
      this.logger.error(`> ${error}`);
      return { message: error.message };
    }
  }
}
