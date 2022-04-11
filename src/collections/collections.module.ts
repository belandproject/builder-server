import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Collection } from './entities/collection.entity';
import { AuthenticationMiddleware } from 'src/common/middlewares/authentication.middleware';
import { ConfigModule } from '@nestjs/config';
import { Item } from 'src/items/entities/item.entity';

@Module({
  controllers: [CollectionsController],
  imports: [SequelizeModule.forFeature([Collection, Item]), ConfigModule],
  providers: [CollectionsService],
})
export class CollectionsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes('/v1/collections/(.*)', '/v1/collections');
  }
}
