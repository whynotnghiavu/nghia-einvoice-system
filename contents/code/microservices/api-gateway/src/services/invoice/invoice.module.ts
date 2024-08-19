import { Module } from '@nestjs/common';
import { NatsClientModule } from '../../nats-client/nats-client.module';
import { InvoiceController } from './invoice.controller';
import { ProductController } from './product.controller';

@Module({
  imports: [NatsClientModule],
  controllers: [ProductController, InvoiceController],
  providers: [],
})
export class InvoiceModule {}
