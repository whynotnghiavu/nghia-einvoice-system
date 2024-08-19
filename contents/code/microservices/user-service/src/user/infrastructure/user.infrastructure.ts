import * as Joi from '@hapi/joi';

import { MicroservicesTctPort } from '../core/application/ports/tct/tct.port';
import { TctAdapter } from './tct/adapters/tct.adapter';

import { MailerPort } from '../core/application/ports/mailer/mailer.port';
import { MailerAdapter } from './mailer/adapters/mailer.adapter';
import { MailerConfig } from './mailer/config/mailer.config';

import { MessageQueuePort } from '../core/application/ports/publisher/message-queue.port';
import { QueueAdapter } from './queue/adapters/queue.adapter';
import { QueueConfig } from './queue/config/queue.config';

import { DatabaseConfig } from './dataaccess/config/database.config';

import { AddressEntity } from './dataaccess/entities/address.entity';
import { BankDetailEntity } from './dataaccess/entities/bank-detail.entity';
import { BankEntity } from './dataaccess/entities/bank.entity';
import { CityEntity } from './dataaccess/entities/city.entity';
import { DistrictEntity } from './dataaccess/entities/district.entity';
import { TaxOfficeEntity } from './dataaccess/entities/tax-office.entity';
import { TaxPayerEntity } from './dataaccess/entities/tax-payer.entity';
import { WardEntity } from './dataaccess/entities/ward.entity';

import { AddressSeeder } from './dataaccess/seeders/address.seeder';
import { BankSeeder } from './dataaccess/seeders/bank.seeder';
import { TaxOfficeSeeder } from './dataaccess/seeders/tax-office.seeder';

import { AddressOrmRepository } from './dataaccess/repositories/address.orm-repository';
import { BankDetailOrmRepository } from './dataaccess/repositories/bank-detail.orm-repository';
import { BankOrmRepository } from './dataaccess/repositories/bank.orm-repository';
import { TaxOfficeOrmRepository } from './dataaccess/repositories/tax-office.orm-repository';
import { TaxPayerOrmRepository } from './dataaccess/repositories/tax-payer.orm-repository';
import { WardOrmRepository } from './dataaccess/repositories/ward.orm-repository';

import { AddressRepositoryPort } from '../core/application/ports/dataaccess/repositories/address.repository.port';
import { BankDetailRepositoryPort } from '../core/application/ports/dataaccess/repositories/bank-detail.repository.port';
import { BankRepositoryPort } from '../core/application/ports/dataaccess/repositories/bank.repository.port';
import { TaxOfficeRepositoryPort } from '../core/application/ports/dataaccess/repositories/tax-office.repository.port';
import { TaxPayerRepositoryPort } from '../core/application/ports/dataaccess/repositories/tax-payer.repository.port';
import { WardRepositoryPort } from '../core/application/ports/dataaccess/repositories/ward.repository.port';

export const UserInfrastructure = {
  validations: Joi.object({
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.string().required(),
    DATABASE_USERNAME: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_NAME: Joi.string().required(),

    MAIL_HOST: Joi.string().required(),
    MAIL_PORT: Joi.string().required(),
  }),
  configs: [
    DatabaseConfig.configs(),
    MailerConfig.configs(),
    QueueConfig.configs(),
  ],

  repositories: [
    TaxOfficeEntity,
    BankEntity,
    CityEntity,
    DistrictEntity,
    WardEntity,
    AddressEntity,
    BankDetailEntity,
    TaxPayerEntity,
  ],
  seeders: [TaxOfficeSeeder, BankSeeder, AddressSeeder],
  providers: [
    {
      provide: MicroservicesTctPort,
      useClass: TctAdapter,
    },
    {
      provide: MailerPort,
      useClass: MailerAdapter,
    },
    {
      provide: MessageQueuePort,
      useClass: QueueAdapter,
    },
    {
      provide: TaxPayerRepositoryPort,
      useClass: TaxPayerOrmRepository,
    },
    {
      provide: TaxOfficeRepositoryPort,
      useClass: TaxOfficeOrmRepository,
    },
    {
      provide: BankRepositoryPort,
      useClass: BankOrmRepository,
    },
    {
      provide: WardRepositoryPort,
      useClass: WardOrmRepository,
    },
    {
      provide: BankDetailRepositoryPort,
      useClass: BankDetailOrmRepository,
    },
    {
      provide: AddressRepositoryPort,
      useClass: AddressOrmRepository,
    },
  ],
};
