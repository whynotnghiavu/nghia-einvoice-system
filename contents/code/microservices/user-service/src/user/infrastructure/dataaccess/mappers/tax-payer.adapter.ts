import { BankDetail } from './../../../core/domain/entities/bank-detail';
import { TaxPayerEntity } from '../entities/tax-payer.entity';
import { TaxPayer } from '../../../core/domain/entities/tax-payer';

import { TaxCode } from '../../../core/domain/value-objects/tax-code';

import { Email } from '../../../core/domain/value-objects/email';

import { PhoneNumber } from '../../../core/domain/value-objects/phone-number';
import { TaxOfficeId } from '../../../core/domain/value-objects/tax-office-id';
import { BankDetailId } from '../../../core/domain/value-objects/bank-detail-id';
import { AddressId } from '../../../core/domain/value-objects/address-id';
import { TaxOfficeEntity } from '../entities/tax-office.entity';
import { BankDetailEntity } from '../entities/bank-detail.entity';
import { AddressEntity } from '../entities/address.entity';

export class TaxPayerAdapter {
  static toDomain(TaxPayerEntity: TaxPayerEntity): TaxPayer {
    if (!TaxPayerEntity) return null;

    const TaxPayerModel = TaxPayer.Builder(new TaxCode(TaxPayerEntity.id))
      .withName(TaxPayerEntity.name)
      .withEmail(new Email(TaxPayerEntity.email))
      .withPassword(TaxPayerEntity.password)
      .withPhoneNumber(new PhoneNumber(TaxPayerEntity.phoneNumber))
      .withTaxOfficeId(new TaxOfficeId(TaxPayerEntity.taxOffice.id))
      .withBankDetailId(new BankDetailId(TaxPayerEntity.bankDetail.id))
      .withAddressId(new AddressId(TaxPayerEntity.address.id))
      .withTaxPayerStatus(TaxPayerEntity.taxPayerStatus)
      .withIsUsbToken(TaxPayerEntity.isUsbToken)
      .withUsbToken(TaxPayerEntity.usbToken)
      .build();

    return TaxPayerModel;
  }

  static toPersistence(TaxPayer: TaxPayer): TaxPayerEntity {
    if (!TaxPayer) return null;

    const entity = new TaxPayerEntity();

    entity.id = TaxPayer.taxCode.value;
    entity.name = TaxPayer.name;
    entity.email = TaxPayer.email.value;
    entity.password = TaxPayer.password;
    entity.phoneNumber = TaxPayer.phoneNumber.value;

    const TaxOffice = new TaxOfficeEntity();
    TaxOffice.id = TaxPayer.taxOfficeId.value;
    entity.taxOffice = TaxOffice;

    const BankDetail = new BankDetailEntity();
    BankDetail.id = TaxPayer.bankDetailId.value;
    entity.bankDetail = BankDetail;

    const Address = new AddressEntity();
    Address.id = TaxPayer.addressId.value;
    entity.address = Address;

    entity.taxPayerStatus = TaxPayer.taxPayerStatus;

    entity.isUsbToken = TaxPayer.isUsbToken;
    entity.usbToken = TaxPayer.usbToken;

    return entity;
  }
}
