import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AssetPacksService } from './asset-packs.service';
import { AssetPacksController } from './asset-packs.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AssetPack } from './entities/asset-pack.entity';
import { AuthenticationMiddleware } from 'src/common/middlewares/authentication.middleware';
import { OptionalAuthenticationMiddleware } from 'src/common/middlewares/optional-authentication.middleware';
import { Asset } from 'src/assets/entities/asset.entity';
import { StorageService } from 'src/storage/storage.service';

@Module({
  controllers: [AssetPacksController],
  providers: [AssetPacksService, StorageService],
  imports: [SequelizeModule.forFeature([AssetPack, Asset])],
})
export class AssetPacksModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude({
        path: '/v1/asset-packs',
        method: RequestMethod.GET,
      })
      .forRoutes('/v1/asset-packs/(.*)', '/v1/asset-packs');

    consumer.apply(OptionalAuthenticationMiddleware).forRoutes({
      path: '/v1/asset-packs',
      method: RequestMethod.GET,
    });
  }
}
