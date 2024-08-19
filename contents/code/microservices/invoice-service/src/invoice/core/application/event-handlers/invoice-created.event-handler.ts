import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InvoiceCreatedEvent } from '../../domain/events/invoice-created.event';
import { InvoiceException } from '../../domain/exceptions/invoice.exception';
import { ProductId } from '../../domain/value-objects/product-id';
import { ProductRepositoryPort } from '../ports/dataaccess/repositories/product.repository.port';
import { TaxPayerRepositoryPort } from '../ports/dataaccess/repositories/tax-payer.repository.port';
import { MailerPort } from '../ports/mailer/mailer.port';

@EventsHandler(InvoiceCreatedEvent)
export class InvoiceCreatedEventHandler
  implements IEventHandler<InvoiceCreatedEvent>
{
  private readonly logger = new Logger(InvoiceCreatedEventHandler.name);
  constructor(
    private readonly mailerPort: MailerPort,
    private readonly TaxPayerRepositoryPort: TaxPayerRepositoryPort,
    private readonly ProductRepositoryPort: ProductRepositoryPort,
  ) {}

  async handle(event: InvoiceCreatedEvent) {
    try {
      this.logger.debug(`> event: ${JSON.stringify(event)}`);

      const product = event.newInvoice.invoiceItems.map(async (item) => {
        const itemProduct = await this.ProductRepositoryPort.getOneById(
          item.productId,
        );
        return {
          name: itemProduct.name,
        };
      });
      for (const item of event.newInvoice.invoiceItems) {
        const product = await this.ProductRepositoryPort.getOneById(
          item.productId,
        );
        item.productId = new ProductId(product.name);
      }

      const findBuyer = await this.TaxPayerRepositoryPort.getOneById(
        event.newInvoice.buyerId,
      );
      if (!findBuyer) {
        throw new InvoiceException('Không tìm thấy người mua');
      }

      this.mailerPort.send(
        findBuyer.email,
        'Thông báo tạo hóa đơn mới',
        'invoice-created.hbs',
        {
          name: findBuyer.name,
          newInvoice: event.newInvoice,
          product: product,
          url: `${process.env.APP_DOMAIN}:${process.env.APP_PORT}/swagger`,
        },
      );

      this.logger.log(`> Gửi email: ${JSON.stringify(findBuyer.email)}`);
    } catch (error) {
      return { message: error.message };
    }
  }
}
