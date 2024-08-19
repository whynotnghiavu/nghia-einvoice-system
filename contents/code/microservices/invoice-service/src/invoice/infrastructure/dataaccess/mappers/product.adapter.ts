import { Product } from '../../../core/domain/entities/product';
import { ProductEntity } from '../entities/product.entity';


import { Money } from '../../../core/domain/value-objects/money';
import { ProductId } from '../../../core/domain/value-objects/product-id';
import { TaxCode } from '../../../core/domain/value-objects/tax-code';
import { TaxPayerEntity } from '../entities/tax-payer.entity';

export class ProductAdapter {
  static toDomain(ProductEntity: ProductEntity): Product {
    if (!ProductEntity) return null;

    const ProductModel = Product.Builder(new ProductId(ProductEntity.id))
      .withName(ProductEntity.name)
      .withUnit(ProductEntity.unit)
      .withPrice(new Money(ProductEntity.price))
      .withTaxRate(ProductEntity.taxRate)
      .withDescription(ProductEntity.description)
      .withTaxPayerId(new TaxCode(ProductEntity.taxPayer.id))
      .build();

    return ProductModel;
  }

  static toPersistence(Product: Product): ProductEntity {
    if (!Product) return null;

    const entity = new ProductEntity();

    entity.id = Product.productId.value;

    entity.name = Product.name;
    entity.unit = Product.unit;
    entity.price = Product.price.value;
    entity.taxRate = Product.taxRate;
    entity.description = Product.description;

    const taxPayer = new TaxPayerEntity();
    taxPayer.id = Product.taxPayerId.value;
    entity.taxPayer = taxPayer;

    return entity;
  }
}
