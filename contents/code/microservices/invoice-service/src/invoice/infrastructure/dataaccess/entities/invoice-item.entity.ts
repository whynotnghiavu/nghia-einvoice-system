import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { InvoiceEntity } from './invoice.entity';
import { ProductEntity } from './product.entity';

@Entity()
export class InvoiceItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductEntity, (product) => product.invoiceItems, {
    nullable: false,
  })
  product: ProductEntity;

  @Column({ nullable: false })
  quantity: number;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  taxRate: number;

  @Column({ nullable: false })
  subTotal: number;

  @ManyToOne(() => InvoiceEntity, (invoice) => invoice.invoiceItems, {
    nullable: false,
  })
  invoice: InvoiceEntity;
}
