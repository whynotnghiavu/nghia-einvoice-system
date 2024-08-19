import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Ward } from './ward.entity';
import { City } from './city.entity';

@Entity()
export class District {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => Ward, (ward) => ward.district, { cascade: true })
  wards: Ward[];

  @ManyToOne(() => City, (city) => city.districts, { nullable: false })
  city: City;
}
