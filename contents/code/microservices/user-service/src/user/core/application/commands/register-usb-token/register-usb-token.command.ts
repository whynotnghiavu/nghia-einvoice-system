import { ICommand } from '@nestjs/cqrs';

export class RegisterUsbTokenCommand implements ICommand {
  constructor(public readonly taxCode: string) {}
}
