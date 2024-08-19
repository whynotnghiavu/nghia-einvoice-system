import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BankDetailRepositoryPort } from '../../../core/application/ports/dataaccess/repositories/bank-detail.repository.port';

import { BankDetailId } from '../../../core/domain/value-objects/bank-detail-id';
import { BankId } from '../../../core/domain/value-objects/bank-id';
import { BankDetailEntity } from '../entities/bank-detail.entity';
import { BankDetailAdapter } from '../mappers/bank-detail.adapter';
import { BankDetail } from './../../../core/domain/entities/bank-detail';

@Injectable()
export class BankDetailOrmRepository implements BankDetailRepositoryPort {
  constructor(
    @InjectRepository(BankDetailEntity)
    private readonly BankDetailEntityRepository: Repository<BankDetailEntity>,
  ) {}

  async save(BankDetail: BankDetail): Promise<BankDetail> {
    const persistenceModel = BankDetailAdapter.toPersistence(BankDetail);
    const newEntity =
      await this.BankDetailEntityRepository.save(persistenceModel);
    return BankDetailAdapter.toDomain(newEntity);
  }

  async getAll(): Promise<BankDetail[]> {
    const entities = await this.BankDetailEntityRepository.find({
      relations: {
        bank: true,
      },
    });

    return entities.map((item) => BankDetailAdapter.toDomain(item));
  }

  async getOneById(id: BankDetailId): Promise<BankDetail> {
    const entity = await this.BankDetailEntityRepository.findOne({
      where: {
        id: id.value,
      },
      relations: {
        bank: true,
      },
    });

    return BankDetailAdapter.toDomain(entity);
  }

  async delete(BankDetail: BankDetail): Promise<boolean> {
    const persistenceModel = BankDetailAdapter.toPersistence(BankDetail);
    const result =
      await this.BankDetailEntityRepository.delete(persistenceModel);
    return result.affected > 0;
  }

  async getAccountBank(accountBank: string, bankId: BankId): Promise<boolean> {
    const entity = await this.BankDetailEntityRepository.findOne({
      where: {
        accountBank,
        bank: {
          id: bankId.value,
        },
      },
    });

    return !!entity;
  }
}
