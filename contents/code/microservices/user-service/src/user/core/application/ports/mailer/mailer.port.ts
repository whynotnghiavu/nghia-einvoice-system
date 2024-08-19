import { IMailer } from '@vuvannghia/common';
import { Email } from '../../../domain/value-objects/email';

export abstract class MailerPort implements IMailer {
  abstract send(receiver: Email, title: string, template: string, context: any);
}
