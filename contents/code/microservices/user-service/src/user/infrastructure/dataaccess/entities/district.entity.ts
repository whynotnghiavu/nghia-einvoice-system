import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CityEntity } from './city.entity';
import { WardEntity } from './ward.entity';

@Entity()
export class DistrictEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => WardEntity, (ward) => ward.district, { cascade: true })
  wards: WardEntity[];

  @ManyToOne(() => CityEntity, (city) => city.districts, { nullable: false })
  city: CityEntity;
}
