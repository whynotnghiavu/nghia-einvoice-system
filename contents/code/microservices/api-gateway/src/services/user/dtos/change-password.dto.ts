import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

import * as faker from 'faker';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Mật khẩu mới',
    example: faker.internet.password(),
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({
    description: 'Mật khẩu xác nhận',
    example: faker.internet.password(),
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly passwordConfirm: string;

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
