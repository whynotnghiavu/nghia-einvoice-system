import { Money } from '../value-objects/money';
import { ProductId } from '../value-objects/product-id';
import { TaxCode } from '../value-objects/tax-code';

export class Product {
  productId: ProductId;
  name: string;
  unit: string;
  price: Money;
  taxRate: number;
  description: string;

  taxPayerId: TaxCode;

  update(
    name: string,
    unit: string,
    price: Money,
    description: string,
    taxRate: number,
  ) {
    if (name) {
      this.name = name;
    }

    if (unit) {
      this.unit = unit;
    }

    if (price) {
      this.price = price;
    }
    if (taxRate) {
      this.taxRate = taxRate;
    }

    if (description) {
      this.description = description;
    }
  }

  constructor(productId: ProductId) {
    this.productId = productId;
  }

  static Builder(productId: ProductId): ProductBuilder {
    return new ProductBuilder(productId);
  }
}

class ProductBuilder {
  private product: Product;

  constructor(productId: ProductId) {
    this.product = new Product(productId);
  }

  withName(name: string): ProductBuilder {
    this.product.name = name;
    return this;
  }

  withUnit(unit: string): ProductBuilder {
    this.product.unit = unit;
    return this;
  }

  withPrice(price: Money): ProductBuilder {
    this.product.price = price;
    return this;
  }

  withTaxRate(taxRate: number): ProductBuilder {
    this.product.taxRate = taxRate;
    return this;
  }

  withDescription(description: string): ProductBuilder {
    this.product.description = description;
    return this;
  }

  withTaxPayerId(taxPayerId: TaxCode): ProductBuilder {
    this.product.taxPayerId = taxPayerId;
    return this;
  }

  build(): Product {
    return this.product;
  }
}
