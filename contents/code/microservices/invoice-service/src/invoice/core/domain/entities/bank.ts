import { BankId } from '../value-objects/bank-id';

export class Bank {
  bankId: BankId;
  name: string;
  code: string;
  shortName: string;

  constructor(bankId: BankId) {
    this.bankId = bankId;
  }
}
