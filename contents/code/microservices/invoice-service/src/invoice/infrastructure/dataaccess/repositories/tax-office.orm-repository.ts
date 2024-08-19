import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TaxOfficeRepositoryPort } from '../../../core/application/ports/dataaccess/repositories/tax-office.repository.port';

import { TaxOfficeId } from '../../../core/domain/value-objects/tax-office-id';
import { TaxOfficeEntity } from '../entities/tax-office.entity';
import { TaxOfficeAdapter } from '../mappers/tax-office.adapter';
import { TaxOffice } from './../../../core/domain/entities/tax-office';

@Injectable()
export class TaxOfficeOrmRepository implements TaxOfficeRepositoryPort {
  constructor(
    @InjectRepository(TaxOfficeEntity)
    private readonly TaxOfficeEntityRepository: Repository<TaxOfficeEntity>,
  ) {}

  async save(TaxOffice: TaxOffice): Promise<TaxOffice> {
    const persistenceModel = TaxOfficeAdapter.toPersistence(TaxOffice);
    const newEntity =
      await this.TaxOfficeEntityRepository.save(persistenceModel);
    return TaxOfficeAdapter.toDomain(newEntity);
  }

  async getAll(): Promise<TaxOffice[]> {
    const entities = await this.TaxOfficeEntityRepository.find({
      relations: {
        taxPayers: true,
      },
    });

    return entities.map((item) => TaxOfficeAdapter.toDomain(item));
  }

  async getOneById(id: TaxOfficeId): Promise<TaxOffice> {
    const entity = await this.TaxOfficeEntityRepository.findOne({
      where: {
        id: id.value,
      },
      relations: {
        taxPayers: true,
      },
    });

    return TaxOfficeAdapter.toDomain(entity);
  }

  async delete(TaxOffice: TaxOffice): Promise<boolean> {
    const persistenceModel = TaxOfficeAdapter.toPersistence(TaxOffice);
    const result =
      await this.TaxOfficeEntityRepository.delete(persistenceModel);
    return result.affected > 0;
  }
}
