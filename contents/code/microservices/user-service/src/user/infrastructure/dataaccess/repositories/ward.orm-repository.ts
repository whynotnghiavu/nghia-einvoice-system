import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WardRepositoryPort } from '../../../core/application/ports/dataaccess/repositories/ward.repository.port';

import { WardId } from '../../../core/domain/value-objects/ward-id';
import { WardEntity } from '../entities/ward.entity';
import { WardAdapter } from '../mappers/ward.adapter';
import { Ward } from './../../../core/domain/entities/ward';

@Injectable()
export class WardOrmRepository implements WardRepositoryPort {
  constructor(
    @InjectRepository(WardEntity)
    private readonly WardEntityRepository: Repository<WardEntity>,
  ) {}

  async save(Ward: Ward): Promise<Ward> {
    const persistenceModel = WardAdapter.toPersistence(Ward);
    const newEntity = await this.WardEntityRepository.save(persistenceModel);
    return WardAdapter.toDomain(newEntity);
  }

  async getAll(): Promise<Ward[]> {
    const entities = await this.WardEntityRepository.find({
      relations: {
        addresses: true,
        district: true,
      },
    });

    return entities.map((item) => WardAdapter.toDomain(item));
  }

  async getOneById(id: WardId): Promise<Ward> {
    const entity = await this.WardEntityRepository.findOne({
      where: {
        id: id.value,
      },
      relations: {
        addresses: true,
        district: true,
      },
    });

    return WardAdapter.toDomain(entity);
  }

  async delete(Ward: Ward): Promise<boolean> {
    const persistenceModel = WardAdapter.toPersistence(Ward);
    const result = await this.WardEntityRepository.delete(persistenceModel);
    return result.affected > 0;
  }
}
