import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TaxOffice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;
}
