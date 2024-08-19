import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { District } from './district.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => District, (district) => district.city, { cascade: true })
  districts: District[];
}
