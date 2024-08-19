import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BankEntity } from '../entities/bank.entity';
import { dataBank } from './data/bank.data';

@Injectable()
export class BankSeeder implements OnModuleInit {
  private logger = new Logger(BankSeeder.name);

  constructor(
    @InjectRepository(BankEntity)
    private readonly BankEntityRepository: Repository<BankEntity>,
  ) {}

  async onModuleInit() {
    try {
      const sum = await this.BankEntityRepository.count();
      if (sum < dataBank.length) {
        for (const item of dataBank) {
          const newBankEntity = this.BankEntityRepository.create({
            id: String(item.id),
            name: item.name,
            code: item.code,
            shortName: item.shortName,
          });
          await this.BankEntityRepository.save(newBankEntity);
        }
      }

      this.logger.log('Seeder successfully!');
    } catch (error) {
      this.logger.error('Error seeding data:', error);
    }
  }
}
