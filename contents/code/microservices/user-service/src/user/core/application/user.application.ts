import { CqrsModule } from '@nestjs/cqrs';

import { EncryptionEmailService } from '../domain/services/encryption-email.service';
import { HashPasswordService } from '../domain/services/hash-password.service';
import { UsbTokenAuthenticationService } from '../domain/services/usb-token-authentication.service';
import { ChangePasswordCommandHandler } from './commands/change-password/change-password.command-handler';
import { DeleteTaxPayerCommandHandler } from './commands/delete-tax-payer/delete-tax-payer.command-handler';
import { RegisterTaxPayerCommandHandler } from './commands/register-tax-payer/register-tax-payer.command-handler';
import { RegisterUsbTokenCommandHandler } from './commands/register-usb-token/register-usb-token.command-handler';
import { UpdateTaxPayerCommandHandler } from './commands/update-tax-payer/update-tax-payer.command-handler';
import { VerifyEmailTaxPayerCommandHandler } from './commands/verify-email-tax-payer/verify-email-tax-payer.command-handler';
import { VerifyResetPasswordCommandHandler } from './commands/verify-reset-password/verify-reset-password.command-handler';
import { TaxPayerActivatedEventHandler } from './event-handlers/tax-payer-activated.event-handler';
import { TaxPayerDeletedEventHandler } from './event-handlers/tax-payer-deleted.event-handler';
import { TaxPayerRegisteredEventHandler } from './event-handlers/tax-payer-registered.event-handler';
import { TaxPayerUpdatedEventHandler } from './event-handlers/tax-payer-updated.event-handler';
import { GetTaxPayerCurrentQueryHandler } from './queries/get-tax-payer-current/get-tax-payer-current.query-handler';
import { LoginTaxPayerQueryHandler } from './queries/login-tax-payer/login-tax-payer.query-handler';
import { RequestResetPasswordQueryHandler } from './queries/request-reset-password/request-reset-password.query-handler';

const UserDomainServices: any[] = [
  EncryptionEmailService,
  HashPasswordService,
  UsbTokenAuthenticationService,
];
const UserCommandHandlers: any[] = [
  RegisterTaxPayerCommandHandler,
  VerifyEmailTaxPayerCommandHandler,
  RegisterUsbTokenCommandHandler,
  VerifyResetPasswordCommandHandler,
  ChangePasswordCommandHandler,
  UpdateTaxPayerCommandHandler,
  DeleteTaxPayerCommandHandler,
];
const UserEventHandlers: any[] = [
  TaxPayerRegisteredEventHandler,
  TaxPayerActivatedEventHandler,
  TaxPayerUpdatedEventHandler,
  TaxPayerDeletedEventHandler,
];
const UserQueryHandlers: any[] = [
  LoginTaxPayerQueryHandler,
  GetTaxPayerCurrentQueryHandler,
  RequestResetPasswordQueryHandler,
];

export const UserApplications = {
  imports: [CqrsModule],
  providers: [
    ...UserDomainServices,
    ...UserCommandHandlers,
    ...UserEventHandlers,
    ...UserQueryHandlers,
  ],
};
