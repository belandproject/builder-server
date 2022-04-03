import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { authentication } from './util';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  use(req: any, _res: Response, next: NextFunction) {
    return authentication(req, null, next, false);
  }
}
