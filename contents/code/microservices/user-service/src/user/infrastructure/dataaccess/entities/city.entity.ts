import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { DistrictEntity } from './district.entity';

@Entity()
export class CityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    nullable: false,
  })
  name: string;

  @OneToMany(() => DistrictEntity, (district) => district.city, {
    cascade: true,
  })
  districts: DistrictEntity[];
}
