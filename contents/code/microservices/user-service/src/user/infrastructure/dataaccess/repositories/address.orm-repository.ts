import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AddressRepositoryPort } from '../../../core/application/ports/dataaccess/repositories/address.repository.port';

import { AddressId } from '../../../core/domain/value-objects/address-id';
import { AddressEntity } from '../entities/address.entity';
import { AddressAdapter } from '../mappers/address.adapter';
import { Address } from './../../../core/domain/entities/address';

@Injectable()
export class AddressOrmRepository implements AddressRepositoryPort {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly AddressEntityRepository: Repository<AddressEntity>,
  ) {}

  async save(Address: Address): Promise<Address> {
    const persistenceModel = AddressAdapter.toPersistence(Address);
    const newEntity = await this.AddressEntityRepository.save(persistenceModel);
    return AddressAdapter.toDomain(newEntity);
  }

  async getAll(): Promise<Address[]> {
    const entities = await this.AddressEntityRepository.find({
      relations: {
        ward: true,
      },
    });

    return entities.map((item) => AddressAdapter.toDomain(item));
  }

  async getOneById(id: AddressId): Promise<Address> {
    const entity = await this.AddressEntityRepository.findOne({
      where: {
        id: id.value,
      },
      relations: {
        ward: true,
      },
    });

    return AddressAdapter.toDomain(entity);
  }

  async delete(Address: Address): Promise<boolean> {
    const persistenceModel = AddressAdapter.toPersistence(Address);
    const result = await this.AddressEntityRepository.delete(persistenceModel);
    return result.affected > 0;
  }
}
