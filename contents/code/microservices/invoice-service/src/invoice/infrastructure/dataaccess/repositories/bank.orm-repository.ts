import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BankRepositoryPort } from '../../../core/application/ports/dataaccess/repositories/bank.repository.port';

import { BankId } from '../../../core/domain/value-objects/bank-id';
import { BankEntity } from '../entities/bank.entity';
import { BankAdapter } from '../mappers/bank.adapter';
import { Bank } from './../../../core/domain/entities/bank';

@Injectable()
export class BankOrmRepository implements BankRepositoryPort {
  constructor(
    @InjectRepository(BankEntity)
    private readonly BankEntityRepository: Repository<BankEntity>,
  ) {}

  async save(Bank: Bank): Promise<Bank> {
    const persistenceModel = BankAdapter.toPersistence(Bank);
    const newEntity = await this.BankEntityRepository.save(persistenceModel);
    return BankAdapter.toDomain(newEntity);
  }

  async getAll(): Promise<Bank[]> {
    const entities = await this.BankEntityRepository.find({
      relations: {
        bankDetails: true,
      },
    });

    return entities.map((item) => BankAdapter.toDomain(item));
  }

  async getOneById(id: BankId): Promise<Bank> {
    const entity = await this.BankEntityRepository.findOne({
      where: {
        id: id.value,
      },
      relations: {
        bankDetails: true,
      },
    });

    return BankAdapter.toDomain(entity);
  }

  async delete(Bank: Bank): Promise<boolean> {
    const persistenceModel = BankAdapter.toPersistence(Bank);
    const result = await this.BankEntityRepository.delete(persistenceModel);
    return result.affected > 0;
  }
}
