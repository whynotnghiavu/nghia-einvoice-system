import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import * as faker from 'faker';

export class InvoiceItemDto {
  @ApiProperty({
    description: 'Mã định danh của sản phẩm',
    example: faker.datatype.uuid(),
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  readonly productId: string;

  @ApiProperty({
    description: 'Số lượng sản phẩm',
    example: faker.datatype.number({ min: 0, max: 20 }),
    required: true,
  })
  @IsString()
  @IsOptional()
  readonly quantity: string;

  @ApiProperty({
    description: 'Giá của sản phẩm',
    example: faker.datatype.number({ min: 0, max: 20 }),
    required: true,
  })
  @IsString()
  readonly price: string;

  @ApiProperty({
    description: 'Thuế suất của sản phẩm',
    example: faker.datatype.number({ min: 0, max: 20 }),
    required: true,
  })
  @IsString()
  @IsOptional()
  readonly taxRate: string;
}
export class CreateNewInvoiceDto {
  @ApiProperty({
    description: 'Mã định danh của người mua',
    example: faker.datatype.uuid(),
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly buyerId: string;

  @ApiProperty({ type: [InvoiceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  readonly invoiceItems: Array<{ InvoiceItemDto }>;

  @ApiProperty({
    description: 'Chữ ký số USB Token',
    example: faker.datatype
      .number({ min: 1, max: 999999 })
      .toString()
      .padStart(6, '0'),
    required: true,
  })
  @IsNumberString()
  readonly usbToken: string;
}
