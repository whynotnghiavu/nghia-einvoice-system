import { InvoiceController } from './http/controllers/invoice.controller';
import { ProductController } from './http/controllers/product.controller';
import { ListenerEvent } from './listener/listener-event';

export const InvoiceInterface = {
  resolvers: [],
  controllers: [ProductController, InvoiceController, ListenerEvent],
};
