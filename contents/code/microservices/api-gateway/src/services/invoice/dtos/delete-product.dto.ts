import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

import * as faker from 'faker';

export class DeleteProductDto {
  @ApiProperty({
    description: 'Mã định danh của sản phẩm',
    example: faker.datatype.uuid(),
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly productId: string;

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
