import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { WardEntity } from './ward.entity';

@Entity()
export class AddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  note: string;

  @ManyToOne(() => WardEntity, (ward) => ward.addresses, { nullable: false })
  ward: WardEntity;
}
