import { Address } from '../../../core/domain/entities/address';
import { AddressEntity } from '../entities/address.entity';

import { WardEntity } from '../entities/ward.entity';

import { AddressId } from '../../../core/domain/value-objects/address-id';
import { WardId } from '../../../core/domain/value-objects/ward-id';

export class AddressAdapter {
  static toDomain(AddressEntity: AddressEntity): Address {
    if (!AddressEntity) return null;

    const AddressModel = Address.Builder(new AddressId(AddressEntity.id))
      .withWardId(new WardId(AddressEntity.ward.id))
      .withNoteAddress(AddressEntity.note)
      .build();

    return AddressModel;
  }

  static toPersistence(Address: Address): AddressEntity {
    if (!Address) return null;

    const entity = new AddressEntity();

    entity.id = Address.addressId.value;

    entity.note = Address.note;

    const ward = new WardEntity();
    ward.id = Address.WardId.value;
    entity.ward = ward;

    return entity;
  }
}
