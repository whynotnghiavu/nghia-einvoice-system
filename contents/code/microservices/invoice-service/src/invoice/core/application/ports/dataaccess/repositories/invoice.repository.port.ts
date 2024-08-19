import { IRepository } from '@vuvannghia/common';

import { Invoice } from '../../../../domain/entities/invoice';
import { InvoiceId } from '../../../../domain/value-objects/invoice-id';

export abstract class InvoiceRepositoryPort implements IRepository<Invoice> {
  abstract save(entity: Invoice | Invoice[]): Promise<Invoice>;
  abstract getAll(): Promise<Invoice[]>;
  abstract getOneById(id: InvoiceId): Promise<Invoice>;
  abstract delete(entity: Invoice): Promise<boolean>;
}
