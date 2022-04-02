import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AssetPacksService } from './asset-packs.service';
import { AssetPacksController } from './asset-packs.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AssetPack } from './entities/asset-pack.entity';
import { AuthenticationMiddleware } from 'src/common/middlewares/authentication.middleware';

@Module({
  controllers: [AssetPacksController],
  providers: [AssetPacksService],
  imports: [SequelizeModule.forFeature([AssetPack])],
})
export class AssetPacksModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude({
        path: '/asset-packs',
        method: RequestMethod.GET,
      })
      .forRoutes(AssetPacksController);
  }
}
