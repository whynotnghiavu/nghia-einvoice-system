import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneProductQuery } from './find-one-product.query';

import { InvoiceException } from '../../../domain/exceptions/invoice.exception';
import { UsbTokenAuthenticationService } from '../../../domain/services/usb-token-authentication.service';
import { ProductId } from '../../../domain/value-objects/product-id';
import { TaxCode } from '../../../domain/value-objects/tax-code';
import { ProductRepositoryPort } from '../../ports/dataaccess/repositories/product.repository.port';
import { TaxPayerRepositoryPort } from '../../ports/dataaccess/repositories/tax-payer.repository.port';

@QueryHandler(FindOneProductQuery)
export class FindOneProductQueryHandler
  implements IQueryHandler<FindOneProductQuery>
{
  private readonly logger = new Logger(FindOneProductQueryHandler.name);

  constructor(
    private readonly ProductRepository: ProductRepositoryPort,
    private readonly TaxPayerRepository: TaxPayerRepositoryPort,
    private readonly UsbTokenAuthenticationService: UsbTokenAuthenticationService,
  ) {}

  public async execute(payload: FindOneProductQuery) {
    try {
      this.logger.debug(`> payload: ${JSON.stringify(payload)}`);

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

      return await this.ProductRepository.getOneById(
        new ProductId(payload.productId),
      );
    } catch (error) {
      this.logger.error(`> ${error}`);
      return { message: error.message };
    }
  }
}
