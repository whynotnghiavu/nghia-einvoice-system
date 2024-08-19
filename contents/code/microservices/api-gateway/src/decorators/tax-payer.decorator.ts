import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface TaxPayerJwtPayload {
  taxCode: string;
  iat: number;
  exp: number;
}

export const TaxPayer = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.taxPayer;
  },
);
