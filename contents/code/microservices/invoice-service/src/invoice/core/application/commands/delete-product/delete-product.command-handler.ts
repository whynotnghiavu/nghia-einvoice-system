import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from './delete-product.command';

import { InvoiceException } from '../../../domain/exceptions/invoice.exception';
import { UsbTokenAuthenticationService } from '../../../domain/services/usb-token-authentication.service';
import { ProductId } from '../../../domain/value-objects/product-id';
import { TaxCode } from '../../../domain/value-objects/tax-code';
import { ProductRepositoryPort } from '../../ports/dataaccess/repositories/product.repository.port';
import { TaxPayerRepositoryPort } from '../../ports/dataaccess/repositories/tax-payer.repository.port';

@CommandHandler(DeleteProductCommand)
export class DeleteProductCommandHandler
  implements ICommandHandler<DeleteProductCommand>
{
  constructor(
    private readonly ProductRepository: ProductRepositoryPort,
    private readonly TaxPayerRepository: TaxPayerRepositoryPort,
    private readonly UsbTokenAuthenticationService: UsbTokenAuthenticationService,
  ) {}

  private readonly logger = new Logger(DeleteProductCommandHandler.name);

  public async execute(payload: DeleteProductCommand) {
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

      return await this.ProductRepository.delete(findProduct);
    } catch (error) {
      this.logger.error(`> ${error}`);
      return { message: error.message };
    }
  }
}
