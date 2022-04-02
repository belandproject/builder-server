import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Collection } from './entities/collection.entity';
import { AuthenticationMiddleware } from 'src/common/middlewares/authentication.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [CollectionsController],
  imports: [SequelizeModule.forFeature([Collection]), ConfigModule],
  providers: [CollectionsService],
})
export class CollectionsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude({ path: 'collections', method: RequestMethod.GET })
      .forRoutes(CollectionsController);
  }
}
