import { Module } from '@nestjs/common';

import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        APP_NAME: Joi.string().required(),
        APP_PORT: Joi.string().required(),
        APP_DOMAIN: Joi.string().required(),

        NATS_HOST: Joi.string().required(),

        VERIFY_EMAIL_SECRET: Joi.string().required(),
        VERIFY_RESET_PASSWORD_SECRET: Joi.string().required(),

        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
      }),
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
