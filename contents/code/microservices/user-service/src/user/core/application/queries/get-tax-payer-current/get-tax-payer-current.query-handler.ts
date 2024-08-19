import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TaxPayerException } from '../../../domain/exceptions/tax-payer.exception';
import { TaxCode } from '../../../domain/value-objects/tax-code';
import { GetTaxPayerCurrentQuery } from './get-tax-payer-current.query';

import { AddressRepositoryPort } from '../../ports/dataaccess/repositories/address.repository.port';
import { BankDetailRepositoryPort } from '../../ports/dataaccess/repositories/bank-detail.repository.port';
import { BankRepositoryPort } from '../../ports/dataaccess/repositories/bank.repository.port';
import { TaxOfficeRepositoryPort } from '../../ports/dataaccess/repositories/tax-office.repository.port';
import { TaxPayerRepositoryPort } from '../../ports/dataaccess/repositories/tax-payer.repository.port';
import { WardRepositoryPort } from '../../ports/dataaccess/repositories/ward.repository.port';

@QueryHandler(GetTaxPayerCurrentQuery)
export class GetTaxPayerCurrentQueryHandler
  implements IQueryHandler<GetTaxPayerCurrentQuery>
{
  private readonly logger = new Logger(GetTaxPayerCurrentQueryHandler.name);

  constructor(
    private readonly TaxPayerRepository: TaxPayerRepositoryPort,

    private readonly BankRepository: BankRepositoryPort,
    private readonly WardRepository: WardRepositoryPort,
    private readonly BankDetailRepository: BankDetailRepositoryPort,
    private readonly AddressRepository: AddressRepositoryPort,
    private readonly TaxOfficeRepositoryPort: TaxOfficeRepositoryPort,
  ) {}

  public async execute(payload: GetTaxPayerCurrentQuery) {
    try {
      this.logger.debug(`> payload: ${JSON.stringify(payload)}`);

      const existingTaxPayer = await this.TaxPayerRepository.getOneById(
        new TaxCode(payload.taxCode),
      );
      if (!existingTaxPayer) {
        throw new TaxPayerException('Không tìm thấy thông tin người nộp thuế.');
      }

      const existingTaxOffice = await this.TaxOfficeRepositoryPort.getOneById(
        existingTaxPayer.taxOfficeId,
      );
      const existingBankDetail = await this.BankDetailRepository.getOneById(
        existingTaxPayer.bankDetailId,
      );
      const existingBank = await this.BankRepository.getOneById(
        existingBankDetail.BankId,
      );
      const existingAddress = await this.AddressRepository.getOneById(
        existingTaxPayer.addressId,
      );
      const existingWard = await this.WardRepository.getOneById(
        existingAddress.WardId,
      );
      const {
        password,
        usbToken,
        taxOfficeId,
        bankDetailId,
        addressId,
        ...result
      } = existingTaxPayer;

      return {
        ...result,
        taxOffice: {
          id: existingTaxOffice.taxOfficeId.value,
          name: existingTaxOffice.name,
        },
        bankDetail: {
          accountBank: existingBankDetail.accountBank,
          bank: {
            name: existingBank.name,
            code: existingBank.code,
            shortName: existingBank.shortName,
          },
        },
        address: {
          note: existingAddress.note,
          ward: {
            name: existingWard.name,
          },
        },
      };
    } catch (error) {
      this.logger.error(`> ${error}`);
      return { message: error.message };
    }
  }
}
