import { IQuery } from '@nestjs/cqrs';

export class RequestResetPasswordQuery implements IQuery {
  constructor(public readonly email: string) {}
}
