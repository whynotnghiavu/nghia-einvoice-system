import { InvoiceItemId } from '../value-objects/invoice-item-id';
import { Money } from '../value-objects/money';
import { ProductId } from '../value-objects/product-id';

export class InvoiceItem {
  invoiceItemId: InvoiceItemId;

  productId: ProductId;

  quantity: number;
  price: Money;
  taxRate: number;
  subTotal: Money;

  calculateSubTotal(): void {
    const subTotalAmount = this.price.multiply(this.quantity);
    const taxAmount = subTotalAmount.multiply(this.taxRate / 100);
    this.subTotal = subTotalAmount.add(taxAmount);
  }

  constructor(invoiceItemId: InvoiceItemId) {
    this.invoiceItemId = invoiceItemId;
  }

  static Builder(invoiceItemId: InvoiceItemId): InvoiceItemBuilder {
    return new InvoiceItemBuilder(invoiceItemId);
  }
}

class InvoiceItemBuilder {
  private invoiceItem: InvoiceItem;

  constructor(invoiceItemId: InvoiceItemId) {
    this.invoiceItem = new InvoiceItem(invoiceItemId);
  }

  withProductId(productId: ProductId): InvoiceItemBuilder {
    this.invoiceItem.productId = productId;
    return this;
  }

  withQuantity(quantity: number): InvoiceItemBuilder {
    this.invoiceItem.quantity = quantity;
    return this;
  }

  withPrice(price: Money): InvoiceItemBuilder {
    this.invoiceItem.price = price;
    return this;
  }

  withTaxRate(taxRate: number): InvoiceItemBuilder {
    this.invoiceItem.taxRate = taxRate;
    return this;
  }

  build(): InvoiceItem {
    this.invoiceItem.calculateSubTotal();
    return this.invoiceItem;
  }
}
