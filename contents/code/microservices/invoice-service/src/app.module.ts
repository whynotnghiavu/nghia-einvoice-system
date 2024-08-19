import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        APP_NAME: Joi.string().required(),
        APP_PORT: Joi.string().required(),
        APP_DOMAIN: Joi.string().required(),

        NATS_HOST: Joi.string().required(),
      }),
    }),
    InvoiceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
