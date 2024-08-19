import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from '../entities/bank.entity';
import { dataBank } from './data/bank.data';

@Injectable()
export class BankSeeder implements OnModuleInit {
  private logger = new Logger(BankSeeder.name);

  constructor(
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
  ) {}

  async onModuleInit() {
    try {
      for (const item of dataBank) {
        const existingBank = await this.bankRepository.findOneBy({
          id: item.id,
        });

        if (existingBank) {
          // await this.bankRepository.update(existingBank.id, {
          // name: item.name,
          // code: item.code,
          // shortName: item.shortName,
          // });
        } else {
          const newBank = this.bankRepository.create({
            id: item.id,
            name: item.name,
            code: item.code,
            shortName: item.shortName,
          });

          await this.bankRepository.save(newBank);
        }
      }

      this.logger.log('Seeder successfully!');
    } catch (error) {
      this.logger.error('Error seeding data:', error);
    }
  }
}
