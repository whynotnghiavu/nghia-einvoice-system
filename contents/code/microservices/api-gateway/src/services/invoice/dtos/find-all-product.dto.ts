import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

import * as faker from 'faker';

export class FindAllProductDto {
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
