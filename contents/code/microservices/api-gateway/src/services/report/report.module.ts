import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';

@Module({
  controllers: [ReportController],
  providers: [],
})
export class ReportModule {}
