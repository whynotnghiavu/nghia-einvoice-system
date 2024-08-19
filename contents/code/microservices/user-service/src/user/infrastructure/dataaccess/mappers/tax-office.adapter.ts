import { TaxOffice } from '../../../core/domain/entities/tax-office';
import { TaxOfficeEntity } from '../entities/tax-office.entity';

import { TaxOfficeId } from '../../../core/domain/value-objects/tax-office-id';

export class TaxOfficeAdapter {
  static toDomain(TaxOfficeEntity: TaxOfficeEntity): TaxOffice {
    if (!TaxOfficeEntity) return null;

    const TaxOfficeModel = new TaxOffice(new TaxOfficeId(TaxOfficeEntity.id));
    TaxOfficeModel.name = TaxOfficeEntity.name;
    return TaxOfficeModel;
  }

  static toPersistence(TaxOffice: TaxOffice): TaxOfficeEntity {
    if (!TaxOffice) return null;

    const entity = new TaxOfficeEntity();

    entity.id = TaxOffice.taxOfficeId.value;
    entity.name = TaxOffice.name;

    return entity;
  }
}
