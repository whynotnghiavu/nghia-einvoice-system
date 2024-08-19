import { ICommand } from '@nestjs/cqrs';

export class VerifyResetPasswordCommand implements ICommand {
  constructor(public readonly tokenPassword: string) {}
}
