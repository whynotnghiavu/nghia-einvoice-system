import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingRequestMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const method = req.method;
    const url = req.originalUrl;
    const requestData = JSON.stringify(req.body);

    this.logger.log(`${method} ${url} - Request Data: ${requestData}`);

    next();
  }
}
