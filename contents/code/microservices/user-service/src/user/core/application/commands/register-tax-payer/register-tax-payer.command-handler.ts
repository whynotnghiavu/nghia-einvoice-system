import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { TaxPayer } from '../../../domain/entities/tax-payer';
import { TaxCode } from '../../../domain/value-objects/tax-code';
import { BankDetailId } from './../../../domain/value-objects/bank-detail-id';
import { BankId } from './../../../domain/value-objects/bank-id';
import { PhoneNumber } from './../../../domain/value-objects/phone-number';
import { RegisterTaxPayerCommand } from './register-tax-payer.command';

import { Address } from '../../../domain/entities/address';
import { BankDetail } from '../../../domain/entities/bank-detail';
import { TaxPayerException } from '../../../domain/exceptions/tax-payer.exception';
import { AddressId } from '../../../domain/value-objects/address-id';
import { TaxOfficeId } from '../../../domain/value-objects/tax-office-id';
import { WardId } from '../../../domain/value-objects/ward-id';

import { AddressRepositoryPort } from '../../ports/dataaccess/repositories/address.repository.port';
import { BankDetailRepositoryPort } from '../../ports/dataaccess/repositories/bank-detail.repository.port';
import { BankRepositoryPort } from '../../ports/dataaccess/repositories/bank.repository.port';
import { TaxOfficeRepositoryPort } from '../../ports/dataaccess/repositories/tax-office.repository.port';
import { TaxPayerRepositoryPort } from '../../ports/dataaccess/repositories/tax-payer.repository.port';
import { WardRepositoryPort } from '../../ports/dataaccess/repositories/ward.repository.port';

import { Email } from '../../../domain/value-objects/email';
import { TaxPayerStatus } from '../../../domain/value-objects/tax-payer-status';

import { TaxPayerRegisteredEvent } from '../../../domain/events/tax-payer-registered.event';
import { HashPasswordService } from '../../../domain/services/hash-password.service';
import { MicroservicesTctPort } from '../../ports/tct/tct.port';

@CommandHandler(RegisterTaxPayerCommand)
export class RegisterTaxPayerCommandHandler
  implements ICommandHandler<RegisterTaxPayerCommand>
{
  constructor(
    private readonly MicroservicesTctPort: MicroservicesTctPort,
    private readonly HashPasswordService: HashPasswordService,
    private readonly eventBus: EventBus,
    private readonly TaxPayerRepository: TaxPayerRepositoryPort,
    private readonly TaxOfficeRepository: TaxOfficeRepositoryPort,
    private readonly BankRepository: BankRepositoryPort,
    private readonly WardRepository: WardRepositoryPort,
    private readonly BankDetailRepository: BankDetailRepositoryPort,
    private readonly AddressRepository: AddressRepositoryPort,
  ) {}

  private readonly logger = new Logger(RegisterTaxPayerCommandHandler.name);

  public async execute(payload: RegisterTaxPayerCommand) {
    try {
      this.logger.log(`> payload: ${JSON.stringify(payload)}`);

      const existingEmail = await this.TaxPayerRepository.getOneByEmail(
        new Email(payload.email),
      );
      if (existingEmail) {
        throw new TaxPayerException('Email đã tồn tại.');
      }

      const existingPhoneNumber =
        await this.TaxPayerRepository.getOneByPhoneNumber(
          new PhoneNumber(payload.phoneNumber),
        );
      if (existingPhoneNumber) {
        throw new TaxPayerException('Số điện thoại đã tồn tại.');
      }

      const existingTaxOffice = await this.TaxOfficeRepository.getOneById(
        new TaxOfficeId(payload.taxOfficeId),
      );
      if (!existingTaxOffice) {
        throw new TaxPayerException('Cơ quan thuế không tồn tại');
      }

      const existingBank = await this.BankRepository.getOneById(
        new BankId(payload.bankId),
      );
      if (!existingBank) {
        throw new TaxPayerException('Ngân hàng không tồn tại');
      }

      const exitingWard = await this.WardRepository.getOneById(
        new WardId(payload.wardId),
      );
      if (!exitingWard) {
        throw new TaxPayerException('Phường/xã không tồn tại');
      }

      const exitingBankDetail = await this.BankDetailRepository.getAccountBank(
        payload.accountBank,
        new BankId(payload.bankId),
      );
      if (exitingBankDetail) {
        throw new TaxPayerException('Tài khoản ngân hàng đã tồn tại');
      }

      const newAddress = Address.Builder(new AddressId(randomUUID()))
        .withWardId(new WardId(payload.wardId))
        .withNoteAddress(payload.noteAddress)
        .build();

      const newBankDetail = BankDetail.Builder(new BankDetailId(randomUUID()))
        .withBankId(new BankId(payload.bankId))
        .withAccountBank(payload.accountBank)
        .build();

      const hashPassword = await this.HashPasswordService.hash(
        payload.password,
      );

      const newTaxCode = await this.MicroservicesTctPort.getId();
      if (!newTaxCode) {
        throw new TaxPayerException('Lỗi người nộp thuế không được phê duyệt.');
      }

      const newTaxPayer = TaxPayer.Builder(new TaxCode(newTaxCode))
        .withName(payload.name)
        .withPassword(hashPassword)
        .withEmail(new Email(payload.email))
        .withPhoneNumber(new PhoneNumber(payload.phoneNumber))
        .withTaxOfficeId(new TaxOfficeId(payload.taxOfficeId))
        .withBankDetailId(new BankDetailId(newBankDetail.bankDetailId.value))
        .withAddressId(new AddressId(newAddress.addressId.value))
        .withTaxPayerStatus(TaxPayerStatus.VERIFY_EMAIL)
        .build();

      await this.AddressRepository.save(newAddress);
      await this.BankDetailRepository.save(newBankDetail);
      await this.TaxPayerRepository.save(newTaxPayer);

      this.eventBus.publish(
        new TaxPayerRegisteredEvent(newAddress, newBankDetail, newTaxPayer),
      );

      return { message: 'Đăng ký thành công. Hãy thực hiện xác nhận email.' };
    } catch (error) {
      this.logger.error(`> ${error}`);
      return { message: error.message };
    }
  }
}
