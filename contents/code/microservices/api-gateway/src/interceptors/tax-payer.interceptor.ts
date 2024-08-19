import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TaxPayerInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split('Bearer ')[1];

    if (token) {
      const decoded = this.jwtService.verify(token);
      request.taxPayer = decoded;
    }

    return next.handle();
  }
}
