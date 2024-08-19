import { IRepository } from '@vuvannghia/common';
import { BankDetail } from '../../../../domain/entities/bank-detail';
import { BankDetailId } from '../../../../domain/value-objects/bank-detail-id';
import { BankId } from '../../../../domain/value-objects/bank-id';

export abstract class BankDetailRepositoryPort
  implements IRepository<BankDetail>
{
  abstract save(entity: BankDetail | BankDetail[]): Promise<BankDetail>;
  abstract getAll(): Promise<BankDetail[]>;
  abstract getOneById(id: BankDetailId): Promise<BankDetail>;
  abstract delete(entity: BankDetail): Promise<boolean>;

  abstract getAccountBank(
    accountBank: string,
    bankId: BankId,
  ): Promise<boolean>;
}
