import { Invoice } from '../entities/invoice';

export class InvoiceCreatedEvent {
  constructor(public readonly newInvoice: Invoice) {}
}
