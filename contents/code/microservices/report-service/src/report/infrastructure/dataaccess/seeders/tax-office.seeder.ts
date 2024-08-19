import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxOffice } from '../entities/tax-office.entity';
import { dataTaxOffice } from './data/tax-office.data';

@Injectable()
export class TaxOfficeSeeder implements OnModuleInit {
  private logger = new Logger(TaxOfficeSeeder.name);

  constructor(
    @InjectRepository(TaxOffice)
    private readonly taxOfficeRepository: Repository<TaxOffice>,
  ) {}

  async onModuleInit() {
    try {
      for (const item of dataTaxOffice) {
        const existingTaxOffice = await this.taxOfficeRepository.findOneBy({
          id: Number(item.id),
        });

        if (existingTaxOffice) {
          // await this.taxOfficeRepository.update(existingTaxOffice.id, {
          // name: item.name,
          // });
        } else {
          const newTaxOffice = this.taxOfficeRepository.create({
            id: Number(item.id),
            name: item.name,
          });
          await this.taxOfficeRepository.save(newTaxOffice);
        }
      }

      this.logger.log('Seeder successfully!');
    } catch (error) {
      this.logger.error('Error seeding data:', error);
    }
  }
}
