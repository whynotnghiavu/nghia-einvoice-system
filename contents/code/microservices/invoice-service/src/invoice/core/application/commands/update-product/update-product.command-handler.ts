import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from './update-product.command';

import { InvoiceException } from '../../../domain/exceptions/invoice.exception';
import { UsbTokenAuthenticationService } from '../../../domain/services/usb-token-authentication.service';
import { Money } from '../../../domain/value-objects/money';
import { ProductId } from '../../../domain/value-objects/product-id';
import { TaxCode } from '../../../domain/value-objects/tax-code';
import { ProductRepositoryPort } from '../../ports/dataaccess/repositories/product.repository.port';
import { TaxPayerRepositoryPort } from '../../ports/dataaccess/repositories/tax-payer.repository.port';

@CommandHandler(UpdateProductCommand)
export class UpdateProductCommandHandler
  implements ICommandHandler<UpdateProductCommand>
{
  constructor(
    private readonly ProductRepository: ProductRepositoryPort,
    private readonly TaxPayerRepository: TaxPayerRepositoryPort,
    private readonly UsbTokenAuthenticationService: UsbTokenAuthenticationService,
  ) {}

  private readonly logger = new Logger(UpdateProductCommandHandler.name);

  public async execute(payload: UpdateProductCommand) {
    try {
      this.logger.log(`> payload: ${JSON.stringify(payload)}`);

      const findTaxPayer = await this.TaxPayerRepository.getOneById(
        new TaxCode(payload.taxPayerId),
      );
      if (!findTaxPayer) {
        throw new InvoiceException('Người nộp thuế không tồn tại.');
      }

      const isValidUsbToken = await this.UsbTokenAuthenticationService.verify(
        payload.usbToken,
        findTaxPayer.usbToken,
      );

      if (!isValidUsbToken) {
        throw new InvoiceException('Chữ ký số không đúng.');
      }

      const findProduct = await this.ProductRepository.getOneById(
        new ProductId(payload.productId),
      );
      if (!findProduct) {
        throw new InvoiceException('Sản phẩm không tồn tại.');
      }

      findProduct.update(
        payload.name,
        payload.unit,
        new Money(payload.price),
        payload.description,
        Number(payload.taxRate),
      );
      return await this.ProductRepository.save(findProduct);
    } catch (error) {
      this.logger.error(`> ${error}`);
      return { message: error.message };
    }
  }
}
