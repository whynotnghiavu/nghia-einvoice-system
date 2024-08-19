import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TaxOfficeEntity } from '../entities/tax-office.entity';
import { dataTaxOfficeEntity } from './data/tax-office.data';

@Injectable()
export class TaxOfficeSeeder implements OnModuleInit {
  private logger = new Logger(TaxOfficeSeeder.name);

  constructor(
    @InjectRepository(TaxOfficeEntity)
    private readonly TaxOfficeEntityRepository: Repository<TaxOfficeEntity>,
  ) {}

  async onModuleInit() {
    try {
      const sum = await this.TaxOfficeEntityRepository.count();
      if (sum < dataTaxOfficeEntity.length) {
        for (const item of dataTaxOfficeEntity) {
          const newTaxOfficeEntity = this.TaxOfficeEntityRepository.create({
            id: String(item.id),
            name: item.name,
          });
          await this.TaxOfficeEntityRepository.save(newTaxOfficeEntity);
        }
      }

      this.logger.log('Seeder successfully!');
    } catch (error) {
      this.logger.error('Error seeding data:', error);
    }
  }
}
