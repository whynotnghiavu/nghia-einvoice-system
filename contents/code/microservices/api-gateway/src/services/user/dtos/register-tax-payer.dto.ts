import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

import * as faker from 'faker';

export class RegisterTaxPayerDto {
  @ApiProperty({
    description: 'Tên của người nộp thuế',
    example: faker.name.findName(),
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Email của người nộp thuế',
    example: faker.internet.email(),
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, {
    message: 'Email không đúng định dạng.',
  })
  readonly email: string;

  @ApiProperty({
    description: 'Mật khẩu của tài khoản',
    example: faker.internet.password(),
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({
    description: 'Số điện thoại của người nộp thuế',
    example: faker.phone.phoneNumber(),
    required: true,
  })
  @IsNotEmpty()
  @Matches(
    /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
    { message: 'Số điện thoại không đúng định dạng.' },
  )
  readonly phoneNumber: string;

  @ApiProperty({
    description: 'Mã số cơ quan thuế quản lý',
    example: '1054029',
    required: true,
  })
  @IsNotEmpty()
  readonly taxOfficeId: string;

  @ApiProperty({
    description: 'Mã số ngân hàng',
    example: '1',
    required: true,
  })
  @IsNotEmpty()
  readonly bankId: string;

  @ApiProperty({
    description: 'Số tài khoản ngân hàng',
    example: faker.finance.account(),
    required: true,
  })
  @IsNotEmpty()
  readonly accountBank: string;

  @ApiProperty({
    description: 'Mã số phường/xã',
    example: '00277',
    required: true,
  })
  @IsNotEmpty()
  readonly wardId: string;

  @ApiProperty({
    description: 'Địa chỉ chi tiết',
    example: faker.address.streetAddress(),
    required: true,
  })
  @IsNotEmpty()
  readonly noteAddress: string;
}
