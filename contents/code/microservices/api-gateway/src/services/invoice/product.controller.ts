import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Inject,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  TaxPayer,
  TaxPayerJwtPayload,
} from './../../decorators/tax-payer.decorator';

import { ExcludeValueInterceptor } from '../../interceptors/exclude-value.interceptor';

import { CreateProductDto } from './dtos/create-product.dto';
import { DeleteProductDto } from './dtos/delete-product.dto';
import { FindAllProductDto } from './dtos/find-all-product.dto';
import { FindOneProductDto } from './dtos/find-one-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@ApiTags('Dịch vụ quản lý hóa đơn')
@Controller('invoice')
@UseInterceptors(ExcludeValueInterceptor)
export class ProductController {
  constructor(@Inject('API_GATEWAY') private apiGateway: ClientProxy) {}

  @ApiBearerAuth()
  @Post('create-product')
  @ApiOperation({ summary: 'Tạo sản phẩm mới' })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @TaxPayer() TaxPayer: TaxPayerJwtPayload,
  ) {
    if (!TaxPayer) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.apiGateway.send(
      { cmd: 'create-product' },
      {
        name: createProductDto.name,
        unit: createProductDto.unit,
        price: createProductDto.price,
        description: createProductDto.description,
        taxRate: createProductDto.taxRate,
        taxPayerId: TaxPayer.taxCode,
        usbToken: createProductDto.usbToken,
      },
    );
  }

  @ApiBearerAuth()
  @Post('find-all-product')
  @ApiOperation({ summary: 'Lấy tất cả sản phẩm' })
  async findAllProduct(
    @Body() findAllProductDto: FindAllProductDto,
    @TaxPayer() TaxPayer: TaxPayerJwtPayload,
  ) {
    if (!TaxPayer) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.apiGateway.send(
      { cmd: 'find-all-product' },
      {
        taxPayerId: TaxPayer.taxCode,
        usbToken: findAllProductDto.usbToken,
      },
    );
  }

  @ApiBearerAuth()
  @Post('find-one-product')
  @ApiOperation({ summary: 'Lấy sản phẩm theo id' })
  async findOneProduct(
    @Body() findOneProductDto: FindOneProductDto,
    @TaxPayer() TaxPayer: TaxPayerJwtPayload,
  ) {
    if (!TaxPayer) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.apiGateway.send(
      { cmd: 'find-one-product' },
      {
        productId: findOneProductDto.productId,
        taxPayerId: TaxPayer.taxCode,
        usbToken: findOneProductDto.usbToken,
      },
    );
  }

  @ApiBearerAuth()
  @Patch('update-product')
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  async updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @TaxPayer() TaxPayer: TaxPayerJwtPayload,
  ) {
    if (!TaxPayer) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.apiGateway.send(
      { cmd: 'update-product' },
      {
        productId: updateProductDto.productId,
        name: updateProductDto.name,
        unit: updateProductDto.unit,
        price: updateProductDto.price,
        description: updateProductDto.description,
        taxRate: updateProductDto.taxRate,
        taxPayerId: TaxPayer.taxCode,
        usbToken: updateProductDto.usbToken,
      },
    );
  }

  @ApiBearerAuth()
  @Delete('delete-product')
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  async deleteProduct(
    @Body() DeleteProductDto: DeleteProductDto,
    @TaxPayer() TaxPayer: TaxPayerJwtPayload,
  ) {
    if (!TaxPayer) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.apiGateway.send(
      { cmd: 'delete-product' },
      {
        productId: DeleteProductDto.productId,
        taxPayerId: TaxPayer.taxCode,
        usbToken: DeleteProductDto.usbToken,
      },
    );
  }
}
