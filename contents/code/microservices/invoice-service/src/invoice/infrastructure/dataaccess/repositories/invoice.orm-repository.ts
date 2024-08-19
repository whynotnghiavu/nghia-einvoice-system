import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InvoiceRepositoryPort } from '../../../core/application/ports/dataaccess/repositories/invoice.repository.port';

import { Invoice } from '../../../core/domain/entities/invoice';
import { InvoiceException } from '../../../core/domain/exceptions/invoice.exception';
import { InvoiceId } from '../../../core/domain/value-objects/invoice-id';
import { InvoiceEntity } from '../entities/invoice.entity';
import { InvoiceAdapter } from '../mappers/invoice.adapter';

@Injectable()
export class InvoiceOrmRepository implements InvoiceRepositoryPort {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly InvoiceEntityRepository: Repository<InvoiceEntity>,
  ) {}

  async save(invoice: Invoice): Promise<Invoice> {
    const persistenceModel = InvoiceAdapter.toPersistence(invoice);
    const newEntity = await this.InvoiceEntityRepository.save(persistenceModel);
    return InvoiceAdapter.toDomain(newEntity);
  }

  async getAll(): Promise<Invoice[]> {
    const entities = await this.InvoiceEntityRepository.find({});

    return entities.map((item) => InvoiceAdapter.toDomain(item));
  }

  async getOneById(id: InvoiceId): Promise<Invoice> {
    const entity = await this.InvoiceEntityRepository.findOne({
      where: {
        id: id.value,
      },
      relations: {
        seller: true,
        buyer: true,
        invoiceItems: {
          product: true,
        },
      },
    });

    return InvoiceAdapter.toDomain(entity);
  }

  async delete(Invoice: Invoice): Promise<boolean> {
    throw new InvoiceException('Method not implemented.');
  }
}
