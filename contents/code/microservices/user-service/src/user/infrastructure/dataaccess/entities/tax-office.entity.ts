import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

import { TaxPayerEntity } from './tax-payer.entity';

@Entity()
export class TaxOfficeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    nullable: false,
  })
  name: string;

  @OneToMany(() => TaxPayerEntity, (taxPayer) => taxPayer.taxOffice, {
    cascade: true,
  })
  taxPayers: TaxPayerEntity[];
}
