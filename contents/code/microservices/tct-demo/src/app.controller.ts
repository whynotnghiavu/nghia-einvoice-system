import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller('demo')
@ApiTags('Demo')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('uuid')
  @ApiOperation({ summary: 'Lấy giá trị uuid' })
  getRandomValue() {
    return this.appService.getRandomValue();
  }
}
