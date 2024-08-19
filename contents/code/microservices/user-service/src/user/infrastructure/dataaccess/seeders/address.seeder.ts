import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CityEntity } from '../entities/city.entity';
import { DistrictEntity } from '../entities/district.entity';
import { WardEntity } from '../entities/ward.entity';

import { dataCity } from './data/address.city.data';
import { dataDistrict } from './data/address.district.data';
import { dataWard } from './data/address.ward.data';

@Injectable()
export class AddressSeeder implements OnModuleInit {
  private logger = new Logger(AddressSeeder.name);

  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    @InjectRepository(DistrictEntity)
    private readonly districtRepository: Repository<DistrictEntity>,
    @InjectRepository(WardEntity)
    private readonly wardRepository: Repository<WardEntity>,
  ) {}

  async onModuleInit() {
    try {
      const sumCity = await this.cityRepository.count();
      if (sumCity < dataCity.length) {
        for (const item of dataCity) {
          const newCity = this.cityRepository.create({
            id: String(item.id),
            name: item.name,
          });
          await this.cityRepository.save(newCity);
        }
      }

      const sumDistrict = await this.districtRepository.count();
      if (sumDistrict < dataDistrict.length) {
        for (const item of dataDistrict) {
          const city = await this.cityRepository.findOneBy({
            id: String(item.city),
          });

          const newDistrict = this.districtRepository.create({
            id: String(item.id),
            name: item.name,
            city: city,
          });

          await this.districtRepository.save(newDistrict);
        }
      }

      const sumWard = await this.wardRepository.count();
      if (sumWard < dataWard.length) {
        for (const item of dataWard) {
          const district = await this.districtRepository.findOneBy({
            id: String(item.district),
          });

          const newWard = this.wardRepository.create({
            id: String(item.id),
            name: item.name,
            district: district,
          });

          await this.wardRepository.save(newWard);
        }
      }

      this.logger.log('Seeder successfully!');
    } catch (error) {
      this.logger.error('Error seeding data:', error);
    }
  }
}
