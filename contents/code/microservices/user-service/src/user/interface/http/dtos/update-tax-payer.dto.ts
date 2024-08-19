export class UpdateTaxPayerDto {
  readonly name?: string;
  readonly email?: string;
  readonly phoneNumber?: string;

  readonly taxCode: string;
  readonly usbToken: string;
}
