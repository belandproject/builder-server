import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Item } from './entities/item.entity';
import { AuthenticationMiddleware } from 'src/common/middlewares/authentication.middleware';
import { CollectionsService } from 'src/collections/collections.service';
import { CollectionsModule } from 'src/collections/collections.module';
import { Collection } from 'src/collections/entities/collection.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService, CollectionsService],
  imports: [
    SequelizeModule.forFeature([Item, Collection]),
    CollectionsModule,
    ConfigModule,
  ],
})
export class ItemsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes('/v1/items/(.*)', '/v1/items');
  }
}
