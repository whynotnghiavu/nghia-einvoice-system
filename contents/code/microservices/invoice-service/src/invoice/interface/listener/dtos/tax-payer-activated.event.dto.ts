export class TaxPayerActivatedEventDto {
  constructor(
    public readonly taxCode: string,
    public readonly usbToken: string,
  ) {}
}
