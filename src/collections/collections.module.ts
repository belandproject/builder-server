import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Collection } from './entities/collection.entity';

@Module({
  controllers: [CollectionsController],
  imports: [SequelizeModule.forFeature([Collection])],
  providers: [CollectionsService],
})
export class CollectionsModule {}
