import { IRepository } from '@vuvannghia/common';
import { Product } from '../../../../domain/entities/product';
import { ProductId } from '../../../../domain/value-objects/product-id';

export abstract class ProductRepositoryPort implements IRepository<Product> {
  abstract save(entity: Product | Product[]): Promise<Product>;
  abstract getAll(): Promise<Product[]>;
  abstract getOneById(id: ProductId): Promise<Product>;
  abstract delete(entity: Product): Promise<boolean>;
}
