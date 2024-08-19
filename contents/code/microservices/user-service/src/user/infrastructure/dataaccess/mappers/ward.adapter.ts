import { Ward } from '../../../core/domain/entities/ward';
import { WardEntity } from '../entities/ward.entity';

import { DistrictEntity } from '../entities/district.entity';

import { WardId } from '../../../core/domain/value-objects/ward-id';

export class WardAdapter {
  static toDomain(WardEntity: WardEntity): Ward {
    if (!WardEntity) return null;

    const WardModel = new Ward(new WardId(WardEntity.id));
    WardModel.name = WardEntity.name;

    return WardModel;
  }

  static toPersistence(Ward: Ward): WardEntity {
    if (!Ward) return null;

    const entity = new WardEntity();

    entity.id = Ward.wardId.value;

    entity.name = Ward.name;

    const district = new DistrictEntity();
    district.id = Ward.districtId.value;
    entity.district = district;

    return entity;
  }
}
