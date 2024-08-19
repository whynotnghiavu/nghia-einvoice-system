import { Invoice } from '../../../core/domain/entities/invoice';
import { InvoiceEntity } from '../entities/invoice.entity';


import { InvoiceItem } from '../../../core/domain/entities/invoice-item';
import { InvoiceId } from '../../../core/domain/value-objects/invoice-id';
import { Money } from '../../../core/domain/value-objects/money';
import { ProductId } from '../../../core/domain/value-objects/product-id';
import { TaxCode } from '../../../core/domain/value-objects/tax-code';
import { InvoiceItemEntity } from '../entities/invoice-item.entity';
import { ProductEntity } from '../entities/product.entity';
import { TaxPayerEntity } from '../entities/tax-payer.entity';

export class InvoiceAdapter {
  static toDomain(invoiceEntity: InvoiceEntity): Invoice {
    if (!invoiceEntity) return null;
    const invoiceModel = Invoice.Builder(new InvoiceId(invoiceEntity.id))
      .withSellerId(new TaxCode(invoiceEntity.seller.id))
      .withBuyerId(new TaxCode(invoiceEntity.buyer.id))
      .withItem(
        invoiceEntity.invoiceItems.map((item) =>
          InvoiceItem.Builder(new InvoiceId(item.id))
            .withProductId(new ProductId(item.product.id))
            .withQuantity(item.quantity)
            .withPrice(new Money(item.price))
            .withTaxRate(item.taxRate)
            .build(),
        ),
      )
      .withCreateAt(invoiceEntity.createAt)
      .build();

    return invoiceModel;
  }

  static toPersistence(invoice: Invoice): InvoiceEntity {
    if (!invoice) return null;

    const entity = new InvoiceEntity();
    entity.id = invoice.invoiceId.value;

    const seller = new TaxPayerEntity();
    seller.id = invoice.sellerId.value;
    entity.seller = seller;

    const buyer = new TaxPayerEntity();
    buyer.id = invoice.buyerId.value;
    entity.buyer = buyer;

    entity.invoiceItems = invoice.invoiceItems.map((item) => {
      const invoiceItem = new InvoiceItemEntity();
      invoiceItem.id = item.invoiceItemId.value;

      const product = new ProductEntity();
      product.id = item.productId.value;
      invoiceItem.product = product;

      invoiceItem.quantity = item.quantity;
      invoiceItem.price = item.price.value;
      invoiceItem.taxRate = item.taxRate;
      invoiceItem.subTotal = item.subTotal.value;
      return invoiceItem;
    });

    entity.totalAfterTax = invoice.totalAfterTax.value;
    entity.totalBeforeTax = invoice.totalBeforeTax.value;

    entity.createAt = invoice.createAt;

    return entity;
  }
}
