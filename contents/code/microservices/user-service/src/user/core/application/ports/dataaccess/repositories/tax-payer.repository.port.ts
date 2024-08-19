import { IRepository } from '@vuvannghia/common';

import { TaxPayer } from '../../../../domain/entities/tax-payer';
import { Email } from '../../../../domain/value-objects/email';
import { PhoneNumber } from '../../../../domain/value-objects/phone-number';
import { TaxCode } from '../../../../domain/value-objects/tax-code';

export abstract class TaxPayerRepositoryPort implements IRepository<TaxPayer> {
  abstract save(entity: TaxPayer | TaxPayer[]): Promise<TaxPayer>;
  abstract getAll(): Promise<TaxPayer[]>;
  abstract getOneById(id: TaxCode): Promise<TaxPayer>;
  abstract delete(entity: TaxPayer): Promise<boolean>;

  abstract getOneByEmail(email: Email): Promise<TaxPayer>;
  abstract getOneByPhoneNumber(PhoneNumber: PhoneNumber): Promise<TaxPayer>;
}
