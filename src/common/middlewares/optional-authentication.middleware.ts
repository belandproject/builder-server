import { Injectable, NestMiddleware } from '@nestjs/common';
import { authentication } from './util';

@Injectable()
export class OptionalAuthenticationMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    return authentication(req, null, next, true);
  }
}
