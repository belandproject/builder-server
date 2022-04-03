import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'src/common/paginate/decorator';
import { User } from 'src/common/user.decorator';
import { AssetPacksService } from './asset-packs.service';
import { UpsertAssetPackDto } from './dto/upsert-asset-pack.dto';

@ApiTags('Asset Packs')
@ApiBearerAuth()
@Controller('asset-packs')
export class AssetPacksController {
  constructor(private readonly assetPacksService: AssetPacksService) {}

  @Get()
  findAll(@Paginate() query: PaginateQuery, @User('id') userId) {
    return this.assetPacksService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User('id') userId) {
    return this.assetPacksService.findOne(userId, id);
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
