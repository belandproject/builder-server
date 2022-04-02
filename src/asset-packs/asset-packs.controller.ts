import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'src/common/paginate/decorator';
import { User } from 'src/common/user.decorator';
import { AssetPacksService } from './asset-packs.service';
import { UpsertAssetPackDto } from './dto/upsert-asset-pack.dto';

@Controller('asset-packs')
export class AssetPacksController {
  constructor(private readonly assetPacksService: AssetPacksService) {}

  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.assetPacksService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetPacksService.findOne(id);
  }

  @Post(':id')
  upsert(
    @Param('id') id: string,
    @Body() updateAssetPackDto: UpsertAssetPackDto,
    @User('id') userId,
  ) {
    return this.assetPacksService.upsert(userId, id, updateAssetPackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('id') userId) {
    return this.assetPacksService.remove(userId, id);
  }
}
