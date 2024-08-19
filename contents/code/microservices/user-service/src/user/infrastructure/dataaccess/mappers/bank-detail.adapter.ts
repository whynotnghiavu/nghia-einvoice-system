import { BankDetail } from '../../../core/domain/entities/bank-detail';
import { BankDetailEntity } from '../entities/bank-detail.entity';

import { BankEntity } from '../entities/bank.entity';

import { BankDetailId } from '../../../core/domain/value-objects/bank-detail-id';
import { BankId } from '../../../core/domain/value-objects/bank-id';

export class BankDetailAdapter {
  static toDomain(BankDetailEntity: BankDetailEntity): BankDetail {
    if (!BankDetailEntity) return null;

    const BankDetailModel = BankDetail.Builder(
      new BankDetailId(BankDetailEntity.id),
    )
      .withBankId(new BankId(BankDetailEntity.bank.id))
      .withAccountBank(BankDetailEntity.accountBank)
      .build();

    return BankDetailModel;
  }

  static toPersistence(BankDetail: BankDetail): BankDetailEntity {
    if (!BankDetail) return null;

    const entity = new BankDetailEntity();

    entity.id = BankDetail.bankDetailId.value;
    entity.accountBank = BankDetail.accountBank;

    const bank = new BankEntity();
    bank.id = BankDetail.BankId.value;

    entity.bank = bank;
    return entity;
  }
}
