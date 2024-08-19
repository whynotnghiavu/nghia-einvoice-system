import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Address } from './address.entity';
import { District } from './district.entity';

@Entity()
export class Ward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => Address, (address) => address.ward, { cascade: true })
  addresses: Address[];

  @ManyToOne(() => District, (district) => district.wards, { nullable: false })
  district: District;
}
