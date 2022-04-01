import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';

@Injectable()
export class CollectionGetMiddleware implements NestMiddleware {
  constructor(private readonly service: CollectionsService) {}
  async use(req: any, res: any, next: () => void) {
    const project = await this.service.findOne(req.params.id);
    if (!project) {
      throw new HttpException('Project not found.', HttpStatus.NOT_FOUND);
    }
    req.project = project;
    next();
  }
}
