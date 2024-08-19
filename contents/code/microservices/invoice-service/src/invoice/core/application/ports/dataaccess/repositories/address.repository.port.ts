import { IRepository } from '@vuvannghia/common';
import { Address } from '../../../../domain/entities/address';
import { AddressId } from '../../../../domain/value-objects/address-id';

export abstract class AddressRepositoryPort implements IRepository<Address> {
  abstract save(entity: Address | Address[]): Promise<Address>;
  abstract getAll(): Promise<Address[]>;
  abstract getOneById(id: AddressId): Promise<Address>;
  abstract delete(entity: Address): Promise<boolean>;
}
