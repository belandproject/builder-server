import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { CollectionsService } from 'src/collections/collections.service';
import { ItemsService } from './items.service';

@Injectable()
export class ItemCreateMiddleware implements NestMiddleware {
  constructor(
    private readonly collectionService: CollectionsService,
    private readonly srv: ItemsService,
  ) {}
  async use(req: any, res: any, next: () => void) {
    const collection = await this.collectionService.findOne(
      req.body.collection_id,
    );
    if (!collection) {
      throw new HttpException('collection not found.', HttpStatus.NOT_FOUND);
    }
    req.collection = collection;
    next();
  }
}
