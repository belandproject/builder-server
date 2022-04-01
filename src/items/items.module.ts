import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Item } from './entities/item.entity';
import { AuthenticationMiddleware } from 'src/common/middlewares/authentication.middleware';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService],
  imports: [SequelizeModule.forFeature([Item])],
})
export class ItemsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude({ path: 'items', method: RequestMethod.GET })
      .forRoutes(ItemsController);
  }
}
