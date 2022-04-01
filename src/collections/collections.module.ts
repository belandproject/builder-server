import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Collection } from './entities/collection.entity';
import { AuthenticationMiddleware } from 'src/common/middlewares/authentication.middleware';
import { CollectionGetMiddleware } from './collection_get.middleware';

@Module({
  controllers: [CollectionsController],
  imports: [SequelizeModule.forFeature([Collection])],
  providers: [CollectionsService],
})
export class CollectionsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude({ path: 'collections', method: RequestMethod.GET })
      .forRoutes(CollectionsController);
    consumer
      .apply(CollectionGetMiddleware)
      .forRoutes(
        { path: 'collections/:id', method: RequestMethod.GET },
        { path: 'collections/:id', method: RequestMethod.PUT },
        { path: 'collections/:id', method: RequestMethod.DELETE },
      );
  }
}
