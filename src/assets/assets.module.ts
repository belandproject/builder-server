import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Asset } from './entities/asset.entity';
import { AuthenticationMiddleware } from 'src/common/middlewares/authentication.middleware';
import { AssetPacksModule } from 'src/asset-packs/asset-packs.module';
import { AssetPack } from 'src/asset-packs/entities/asset-pack.entity';

@Module({
  controllers: [AssetsController],
  providers: [AssetsService],
  imports: [SequelizeModule.forFeature([Asset, AssetPack]), AssetPacksModule],
})
export class AssetsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude({
        path: '/assets',
        method: RequestMethod.GET,
      })
      .forRoutes(AssetsController);
  }
}
