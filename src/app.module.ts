import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { getDatabaseConfig } from './common/database.config';
import { ItemsModule } from './items/items.module';
import { CollectionsModule } from './collections/collections.module';
import { AssetPacksModule } from './asset-packs/asset-packs.module';
import { AssetsModule } from './assets/assets.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    ProjectsModule,
    CollectionsModule,
    ItemsModule,
    AssetsModule,
    AssetPacksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
