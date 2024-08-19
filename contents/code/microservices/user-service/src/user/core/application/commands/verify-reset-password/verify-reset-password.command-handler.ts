import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TaxPayerException } from '../../../domain/exceptions/tax-payer.exception';
import { EncryptionEmailService } from '../../../domain/services/encryption-email.service';
import { TaxPayerRepositoryPort } from '../../ports/dataaccess/repositories/tax-payer.repository.port';
import { VerifyResetPasswordCommand } from './verify-reset-password.command';

import { Email } from '../../../domain/value-objects/email';

import * as faker from 'faker';
import { HashPasswordService } from '../../../domain/services/hash-password.service';

@CommandHandler(VerifyResetPasswordCommand)
export class VerifyResetPasswordCommandHandler
  implements ICommandHandler<VerifyResetPasswordCommand>
{
  constructor(
    private readonly HashPasswordService: HashPasswordService,
    private readonly EncryptionEmailService: EncryptionEmailService,
    private readonly TaxPayerRepository: TaxPayerRepositoryPort,
  ) {}

  private readonly logger = new Logger(VerifyResetPasswordCommandHandler.name);

  public async execute(payload: VerifyResetPasswordCommand) {
    try {
      this.logger.log(`> payload: ${JSON.stringify(payload)}`);

      const payloadDecrypt = this.EncryptionEmailService.decrypt(
        payload.tokenPassword,
        process.env.VERIFY_RESET_PASSWORD_SECRET,
      );

      const [email, dateRequest] = payloadDecrypt.split(' ');

      const findTaxPayer = await this.TaxPayerRepository.getOneByEmail(
        new Email(email),
      );
      if (!findTaxPayer) {
        throw new TaxPayerException('Không tìm thấy thông tin người nộp thuế.');
      }

      const newPassword = faker.internet.password();

      const hashNewPassword = await this.HashPasswordService.hash(newPassword);

      findTaxPayer.resetPassword(hashNewPassword, dateRequest);

      await this.TaxPayerRepository.save(findTaxPayer);

      return { newPassword };
    } catch (error) {
      this.logger.error(`> ${error}`);
      return { message: error.message };
    }
  }
}
