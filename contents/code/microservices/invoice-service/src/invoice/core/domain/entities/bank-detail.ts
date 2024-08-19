import { BankDetailId } from '../value-objects/bank-detail-id';
import { BankId } from './../value-objects/bank-id';

export class BankDetail {
  bankDetailId: BankDetailId;
  accountBank: string;
  BankId: BankId;

  constructor(bankDetailId: BankDetailId) {
    this.bankDetailId = bankDetailId;
  }

  static Builder(bankDetailId: BankDetailId): BankDetailBuilder {
    return new BankDetailBuilder(bankDetailId);
  }
}

class BankDetailBuilder {
  private bankDetail: BankDetail;

  constructor(bankDetailId: BankDetailId) {
    this.bankDetail = new BankDetail(bankDetailId);
  }

  withAccountBank(accountBank: string): BankDetailBuilder {
    this.bankDetail.accountBank = accountBank;
    return this;
  }

  withBankId(bankId: BankId): BankDetailBuilder {
    this.bankDetail.BankId = bankId;
    return this;
  }

  build(): BankDetail {
    return this.bankDetail;
  }
}
