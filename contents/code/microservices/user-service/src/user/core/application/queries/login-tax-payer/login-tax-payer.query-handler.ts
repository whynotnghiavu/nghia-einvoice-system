import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { TaxPayerException } from '../../../domain/exceptions/tax-payer.exception';
import { HashPasswordService } from '../../../domain/services/hash-password.service';
import { UsbTokenAuthenticationService } from '../../../domain/services/usb-token-authentication.service';
import { TaxCode } from '../../../domain/value-objects/tax-code';
import { TaxPayerStatus } from '../../../domain/value-objects/tax-payer-status';
import { TaxPayerRepositoryPort } from '../../ports/dataaccess/repositories/tax-payer.repository.port';
import { LoginTaxPayerQuery } from './login-tax-payer.query';

@QueryHandler(LoginTaxPayerQuery)
export class LoginTaxPayerQueryHandler
  implements IQueryHandler<LoginTaxPayerQuery>
{
  private readonly logger = new Logger(LoginTaxPayerQueryHandler.name);

  constructor(
    private readonly UsbTokenAuthenticationService: UsbTokenAuthenticationService,
    private readonly JwtService: JwtService,
    private readonly TaxPayerRepository: TaxPayerRepositoryPort,
    private readonly HashPasswordService: HashPasswordService,
  ) {}

  public async execute(payload: LoginTaxPayerQuery) {
    try {
      this.logger.debug(`> payload: ${JSON.stringify(payload)}`);

      const existingTaxPayer = await this.TaxPayerRepository.getOneById(
        new TaxCode(payload.taxCode),
      );
      if (!existingTaxPayer) {
        throw new TaxPayerException('Thông tin đăng nhập không đúng.');
      }

      if (
        !(await this.HashPasswordService.compare(
          existingTaxPayer.password,
          payload.password,
        ))
      ) {
        throw new TaxPayerException('Thông tin đăng nhập không đúng.');
      }

      if (existingTaxPayer.isUsbToken) {
        const isValid = await this.UsbTokenAuthenticationService.verify(
          payload.usbToken,
          existingTaxPayer.usbToken,
        );

        if (!isValid) {
          throw new TaxPayerException('Chữ ký số không đúng.');
        }
      }

      if (existingTaxPayer.taxPayerStatus === TaxPayerStatus.VERIFY_EMAIL) {
        throw new TaxPayerException('Hãy thực hiện xác thực email.');
      }

      if (existingTaxPayer.taxPayerStatus === TaxPayerStatus.DELETED) {
        throw new TaxPayerException('Tài khoản đã bị xóa.');
      }

      const accessToken = await this.JwtService.signAsync({
        taxCode: existingTaxPayer.taxCode.value,
      });

      return accessToken;
    } catch (error) {
      this.logger.error(`> ${error}`);
      return { message: error.message };
    }
  }
}
