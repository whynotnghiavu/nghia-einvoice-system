import { TaxPayerException } from '../exceptions/tax-payer.exception';
import { AddressId } from '../value-objects/address-id';
import { BankDetailId } from '../value-objects/bank-detail-id';
import { Email } from '../value-objects/email';
import { PhoneNumber } from '../value-objects/phone-number';
import { TaxCode } from '../value-objects/tax-code';
import { TaxOfficeId } from '../value-objects/tax-office-id';
import { TaxPayerStatus } from '../value-objects/tax-payer-status';

export class TaxPayer {
  taxCode: TaxCode;
  name: string;
  email: Email;
  password: string;
  phoneNumber: PhoneNumber;
  taxPayerStatus: TaxPayerStatus;

  taxOfficeId: TaxOfficeId;
  bankDetailId: BankDetailId;
  addressId: AddressId;

  isUsbToken: boolean;
  usbToken: string;

  verifyEmail() {
    if (this.taxPayerStatus != TaxPayerStatus.VERIFY_EMAIL) {
      throw new TaxPayerException('Người nộp thuế đã xác thực email.');
    }
    this.taxPayerStatus = TaxPayerStatus.REGISTER_USB_TOKEN;
  }

  resetPassword(newPassword: string, dateRequest: string) {
    if (new Date(dateRequest) < new Date(new Date().getTime() - 60 * 1000)) {
      throw new TaxPayerException('Yêu cầu khôi phục mật khẩu hết hạn');
    }

    this.password = newPassword;
  }

  registerUsbToken(secret: string) {
    this.isUsbToken = true;
    this.usbToken = secret;
    this.taxPayerStatus = TaxPayerStatus.ACTIVE;
  }
  changePassword(newPassword: string) {
    this.password = newPassword;
  }
  update(name: string, email: Email, phoneNumber: PhoneNumber) {
    if (name) {
      this.name = name;
    }

    if (email) {
      this.email = email;
    }

    if (phoneNumber) {
      this.phoneNumber = phoneNumber;
    }
  }

  delete() {
    if (this.taxPayerStatus === TaxPayerStatus.DELETED) {
      throw new TaxPayerException('Người nộp thuế này đã xóa.');
    }
    this.taxPayerStatus = TaxPayerStatus.DELETED;
  }

  constructor(taxCode: TaxCode) {
    this.taxCode = taxCode;
  }

  static Builder(taxCode: TaxCode): TaxPayerBuilder {
    return new TaxPayerBuilder(taxCode);
  }
}

class TaxPayerBuilder {
  private taxPayer: TaxPayer;

  constructor(taxCode: TaxCode) {
    this.taxPayer = new TaxPayer(taxCode);
  }

  withName(name: string): TaxPayerBuilder {
    this.taxPayer.name = name;
    return this;
  }

  withPassword(password: string): TaxPayerBuilder {
    this.taxPayer.password = password;
    return this;
  }

  withEmail(email: Email): TaxPayerBuilder {
    this.taxPayer.email = email;
    return this;
  }

  withPhoneNumber(phoneNumber: PhoneNumber): TaxPayerBuilder {
    this.taxPayer.phoneNumber = phoneNumber;
    return this;
  }

  withTaxOfficeId(taxOfficeId: TaxOfficeId): TaxPayerBuilder {
    this.taxPayer.taxOfficeId = taxOfficeId;
    return this;
  }

  withBankDetailId(bankDetailId: BankDetailId): TaxPayerBuilder {
    this.taxPayer.bankDetailId = bankDetailId;
    return this;
  }
  withAddressId(addressId: AddressId): TaxPayerBuilder {
    this.taxPayer.addressId = addressId;
    return this;
  }

  withTaxPayerStatus(taxPayerStatus: TaxPayerStatus): TaxPayerBuilder {
    this.taxPayer.taxPayerStatus = taxPayerStatus;
    return this;
  }

  withIsUsbToken(isUsbToken: boolean): TaxPayerBuilder {
    this.taxPayer.isUsbToken = isUsbToken;
    return this;
  }

  withUsbToken(usbToken: string): TaxPayerBuilder {
    this.taxPayer.usbToken = usbToken;
    return this;
  }

  build(): TaxPayer {
    return this.taxPayer;
  }
}
