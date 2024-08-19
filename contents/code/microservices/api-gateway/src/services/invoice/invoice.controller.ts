import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ExcludeValueInterceptor } from '../../interceptors/exclude-value.interceptor';
import {
  TaxPayer,
  TaxPayerJwtPayload,
} from './../../decorators/tax-payer.decorator';

import { CreateNewInvoiceDto } from './dtos/create-new-invoice.dto';
import { FindOneInvoiceDto } from './dtos/find-one-invoice.dto';

@ApiTags('Dịch vụ quản lý hóa đơn')
@Controller('invoice')
@UseInterceptors(ExcludeValueInterceptor)
export class InvoiceController {
  constructor(@Inject('API_GATEWAY') private apiGateway: ClientProxy) {}

  @ApiBearerAuth()
  @Get('find-tax-payer/:taxCode')
  @ApiOperation({ summary: 'Tra cứu người nộp thuế theo mã số thuế' })
  findTaxPayer(
    @Param('taxCode') taxCode: string,
    @TaxPayer() TaxPayer: TaxPayerJwtPayload,
  ) {
    if (!TaxPayer) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.apiGateway.send({ cmd: 'find-tax-payer' }, { taxCode });
  }

  @ApiBearerAuth()
  @Post('create-new-invoice')
  @ApiOperation({ summary: 'Lập hóa đơn mới' })
  async createNewInvoice(
    @Body() createNewInvoiceDto: CreateNewInvoiceDto,
    @TaxPayer() TaxPayer: TaxPayerJwtPayload,
  ) {
    if (!TaxPayer) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.apiGateway.send(
      { cmd: 'create-new-invoice' },
      {
        sellerId: TaxPayer.taxCode,
        buyerId: createNewInvoiceDto.buyerId,
        invoiceItems: createNewInvoiceDto.invoiceItems,
        usbToken: createNewInvoiceDto.usbToken,
      },
    );
  }

  @ApiBearerAuth()
  @Post('find-one-invoice')
  @ApiOperation({ summary: 'Tra cứu hóa đơn theo số hóa đơn' })
  async findOneInvoice(
    @Body() findOneInvoiceDto: FindOneInvoiceDto,
    @TaxPayer() TaxPayer: TaxPayerJwtPayload,
  ) {
    if (!TaxPayer) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.apiGateway.send(
      { cmd: 'find-one-invoice' },
      {
        InvoiceId: findOneInvoiceDto.invoiceId,
        taxPayerId: TaxPayer.taxCode,
        usbToken: findOneInvoiceDto.usbToken,
      },
    );
  }
}
