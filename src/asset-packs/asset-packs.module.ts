import { Module } from '@nestjs/common';
import { AssetPacksService } from './asset-packs.service';
import { AssetPacksController } from './asset-packs.controller';

@Module({
  controllers: [AssetPacksController],
  providers: [AssetPacksService]
})
export class AssetPacksModule {}
