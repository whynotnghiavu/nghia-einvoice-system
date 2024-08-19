import { AddressId } from '../value-objects/address-id';
import { BankDetailId } from '../value-objects/bank-detail-id';
import { Email } from '../value-objects/email';
import { PhoneNumber } from '../value-objects/phone-number';
import { TaxCode } from '../value-objects/tax-code';

export class Seller {
  sellerId: TaxCode;

  name: string;
  email: Email;
  phoneNumber: PhoneNumber;

  addressId: AddressId;
  bankDetailId: BankDetailId;

  constructor(sellerId: TaxCode) {
    this.sellerId = sellerId;
  }

  static Builder(sellerId: TaxCode): SellerBuilder {
    return new SellerBuilder(sellerId);
  }
}

class SellerBuilder {
  private seller: Seller;

  constructor(sellerId: TaxCode) {
    this.seller = new Seller(sellerId);
  }
  withName(name: string): SellerBuilder {
    this.seller.name = name;
    return this;
  }
  withEmail(email: Email): SellerBuilder {
    this.seller.email = email;
    return this;
  }
  withPhoneNumber(phoneNumber: PhoneNumber): SellerBuilder {
    this.seller.phoneNumber = phoneNumber;
    return this;
  }
  withAddressId(addressId: AddressId): SellerBuilder {
    this.seller.addressId = addressId;
    return this;
  }
  withBankDetailId(bankDetailId: BankDetailId): SellerBuilder {
    this.seller.bankDetailId = bankDetailId;
    return this;
  }
  build(): Seller {
    return this.seller;
  }
}
