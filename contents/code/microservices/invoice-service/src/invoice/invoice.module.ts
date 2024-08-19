import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvoiceApplications } from './core/application/invoice.application';
import { InvoiceInfrastructure } from './infrastructure/invoice.infrastructure';
import { InvoiceInterface } from './interface/invoice.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: InvoiceInfrastructure.validations,
    }),
    ...InvoiceInfrastructure.configs,
    TypeOrmModule.forFeature([...InvoiceInfrastructure.repositories]),
    ...InvoiceApplications.imports,
  ],

  providers: [
    ...InvoiceInfrastructure.seeders,
    ...InvoiceInterface.resolvers,
    ...InvoiceInfrastructure.providers,
    ...InvoiceApplications.providers,
  ],
  controllers: [...InvoiceInterface.controllers],
  exports: [],
})
export class InvoiceModule {}
