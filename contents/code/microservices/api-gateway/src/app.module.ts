import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';

import { JwtModule } from '@nestjs/jwt';

import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { TaxPayerInterceptor } from './interceptors/tax-payer.interceptor';
import { LoggingRequestMiddleware } from './middlewares/logging.middleware';

import { InvoiceModule } from './services/invoice/invoice.module';
import { ReportModule } from './services/report/report.module';
import { UserModule } from './services/user/user.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.string().required(),

        NATS_HOST: Joi.string().required(),

        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
      }),
    }),
    ClientsModule.register([
      {
        name: 'API_GATEWAY',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_HOST],
        },
      },
    ]),
    UserModule,
    InvoiceModule,
    ReportModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TaxPayerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingRequestMiddleware).forRoutes('*');
  }
}
