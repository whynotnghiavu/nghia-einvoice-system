import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ClientProxy } from '@nestjs/microservices';

import {
  TaxPayer,
  TaxPayerJwtPayload,
} from '../../decorators/tax-payer.decorator';

import { Response } from 'express';
import { QRCodeSegment, toFileStream } from 'qrcode';

import { ExcludeValueInterceptor } from '../../interceptors/exclude-value.interceptor';

import { ChangePasswordDto } from './dtos/change-password.dto';
import { DeleteTaxPayerDto } from './dtos/delete-tax-payer.dto';
import { LoginTaxPayerDto } from './dtos/login-tax-payer.dto';
import { RegisterTaxPayerDto } from './dtos/register-tax-payer.dto';
import { RequestResetPasswordDto } from './dtos/request-reset-password.dto';
import { UpdateTaxPayerDto } from './dtos/update-tax-payer.dto';

@ApiTags('Dịch vụ quản lý người dùng')
@Controller('user')
@UseInterceptors(ExcludeValueInterceptor)
export class UserController {
  constructor(@Inject('API_GATEWAY') private apiGateway: ClientProxy) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản' })
  register(@Body() registerTaxPayerDto: RegisterTaxPayerDto) {
    return this.apiGateway.send({ cmd: 'register' }, registerTaxPayerDto);
  }

  @Get('verify-email/:tokenEmail')
  @ApiOperation({ summary: 'Xác thực email' })
  verifyEmail(@Param('tokenEmail') tokenEmail: string) {
    return this.apiGateway.send({ cmd: 'verify-email' }, tokenEmail);
  }

  @Post('request-reset-password')
  @ApiOperation({ summary: 'Yêu cầu quên mật khẩu' })
  requestResetPassword(
    @Body() requestResetPasswordDto: RequestResetPasswordDto,
  ) {
    return this.apiGateway.send(
      { cmd: 'request-reset-password' },
      requestResetPasswordDto,
    );
  }

  @Get('verify-reset-password/:tokenPassword')
  @ApiOperation({ summary: 'Xác thực quên mật khẩu' })
  verifyResetPassword(@Param('tokenPassword') tokenPassword: string) {
    return this.apiGateway.send(
      { cmd: 'verify-reset-password' },
      tokenPassword,
    );
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập tài khoản' })
  login(@Body() LoginTaxPayerDto: LoginTaxPayerDto) {
    return this.apiGateway.send({ cmd: 'login' }, LoginTaxPayerDto);
  }

  @ApiBearerAuth()
  @Get('get-tax-payer-current')
  @ApiOperation({ summary: 'Xem thông tin người nộp thuế hiện tại' })
  getTaxPayerCurrent(@TaxPayer() TaxPayer: TaxPayerJwtPayload) {
    if (!TaxPayer) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.apiGateway.send(
      { cmd: 'get-tax-payer-current' },
      { taxCode: TaxPayer.taxCode },
    );
  }

  @Get('register-usb-token')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng ký chữ ký số USB Token' })
  registerUsbTokenHandler(
    @TaxPayer() TaxPayer: TaxPayerJwtPayload,
    @Res() Response: Response,
  ) {
    if (!TaxPayer) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    Response.type('png');

    const result = this.registerUsbToken(TaxPayer);
    result.subscribe((data: string | QRCodeSegment[]) => {
      toFileStream(Response, data);
    });
  }

  registerUsbToken(TaxPayer: TaxPayerJwtPayload) {
    return this.apiGateway.send(
      { cmd: 'register-usb-token' },
      { taxCode: TaxPayer.taxCode },
    );
  }

  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đổi mật khẩu' })
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @TaxPayer() TaxPayer: TaxPayerJwtPayload,
  ) {
    if (!TaxPayer) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.apiGateway.send(
      { cmd: 'change-password' },
      {
        taxCode: TaxPayer.taxCode,
        password: changePasswordDto.password,
        passwordConfirm: changePasswordDto.passwordConfirm,
        usbToken: changePasswordDto.usbToken,
      },
    );
  }

  @Patch('update-tax-payer')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin người nộp thuế' })
  updateTaxPayer(
    @Body() UpdateTaxPayerDto: UpdateTaxPayerDto,
    @TaxPayer() TaxPayer: TaxPayerJwtPayload,
  ) {
    if (!TaxPayer) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.apiGateway.send(
      { cmd: 'update-tax-payer' },
      {
        taxCode: TaxPayer.taxCode,
        name: UpdateTaxPayerDto.name,
        email: UpdateTaxPayerDto.email,
        phoneNumber: UpdateTaxPayerDto.phoneNumber,
        usbToken: UpdateTaxPayerDto.usbToken,
      },
    );
  }

  @Post('delete-tax-payer')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa tài khoản người nộp thuế' })
  deleteTaxPayer(
    @Body() deleteTaxPayerDto: DeleteTaxPayerDto,
    @TaxPayer() TaxPayer: TaxPayerJwtPayload,
  ) {
    if (!TaxPayer) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.apiGateway.send(
      { cmd: 'delete-tax-payer' },
      {
        taxCode: TaxPayer.taxCode,
        usbToken: deleteTaxPayerDto.usbToken,
      },
    );
  }
}
