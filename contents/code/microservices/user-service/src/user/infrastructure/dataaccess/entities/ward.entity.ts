import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AddressEntity } from './address.entity';
import { DistrictEntity } from './district.entity';

@Entity()
export class WardEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => AddressEntity, (address) => address.ward, { cascade: true })
  addresses: AddressEntity[];

  @ManyToOne(() => DistrictEntity, (district) => district.wards, {
    nullable: false,
  })
  district: DistrictEntity;
}
