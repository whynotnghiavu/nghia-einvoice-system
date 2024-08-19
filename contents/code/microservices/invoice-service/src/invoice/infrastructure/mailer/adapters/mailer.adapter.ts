import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailerPort } from '../../../core/application/ports/mailer/mailer.port';
import { Email } from '../../../core/domain/value-objects/email';

@Injectable()
export abstract class MailerAdapter implements MailerPort {
  constructor(private readonly mailerService: MailerService) {}

  send(receiver: Email, title: string, template: string, context: any) {
    this.mailerService.sendMail({
      to: receiver.value,
      subject: title,
      template: template,
      context: context,
    });
  }
}
