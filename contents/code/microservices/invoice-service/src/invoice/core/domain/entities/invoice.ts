import { InvoiceId } from '../value-objects/invoice-id';
import { Money } from '../value-objects/money';
import { TaxCode } from '../value-objects/tax-code';
import { InvoiceItem } from './invoice-item';

export class Invoice {
  invoiceId: InvoiceId;

  sellerId: TaxCode;
  buyerId: TaxCode;

  invoiceItems = new Array<InvoiceItem>();

  totalBeforeTax: Money;
  totalAfterTax: Money;

  createAt: Date;

  calculateTotalBeforeTax(): Money {
    let totalBeforeTaxAmount = new Money(0);
    for (const item of this.invoiceItems) {
      totalBeforeTaxAmount = totalBeforeTaxAmount.add(
        item.price.multiply(item.quantity),
      );
    }
    return totalBeforeTaxAmount;
  }

  calculateTotalAfterTax(): Money {
    let totalAfterTaxAmount = new Money(0);
    for (const item of this.invoiceItems) {
      totalAfterTaxAmount = totalAfterTaxAmount.add(item.subTotal);
    }
    return totalAfterTaxAmount;
  }
  constructor(invoiceId: InvoiceId) {
    this.invoiceId = invoiceId;
  }

  static Builder(invoiceId: InvoiceId): InvoiceBuilder {
    return new InvoiceBuilder(invoiceId);
  }
}

class InvoiceBuilder {
  private invoice: Invoice;

  constructor(invoiceId: InvoiceId) {
    this.invoice = new Invoice(invoiceId);
  }

  withSellerId(sellerId: TaxCode): InvoiceBuilder {
    this.invoice.sellerId = sellerId;
    return this;
  }

  withBuyerId(buyerId: TaxCode): InvoiceBuilder {
    this.invoice.buyerId = buyerId;
    return this;
  }

  withItem(invoiceItems: InvoiceItem[]): InvoiceBuilder {
    invoiceItems.map((item) => this.invoice.invoiceItems.push(item));
    return this;
  }

  withCreateAt(createAt: Date): InvoiceBuilder {
    this.invoice.createAt = createAt;
    return this;
  }

  build(): Invoice {
    this.invoice.totalBeforeTax = this.invoice.calculateTotalBeforeTax();
    this.invoice.totalAfterTax = this.invoice.calculateTotalAfterTax();
    return this.invoice;
  }
}
