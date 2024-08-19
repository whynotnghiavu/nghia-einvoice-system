import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoiceItemEntity } from './invoice-item.entity';
import { TaxPayerEntity } from './tax-payer.entity';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  unit: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  taxRate: number;

  @ManyToOne(() => TaxPayerEntity, (TaxPayer) => TaxPayer.products, {
    nullable: false,
  })
  taxPayer: TaxPayerEntity;

  @OneToMany(() => InvoiceItemEntity, (invoiceItem) => invoiceItem.product, {
    nullable: false,
  })
  invoiceItems: InvoiceItemEntity[];
}
