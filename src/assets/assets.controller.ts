import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'src/common/paginate/decorator';
import { User } from 'src/common/user.decorator';
import { AssetsService } from './assets.service';
import { UpsertAssetDto } from './dto/upsert-asset.dto';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.assetsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id);
  }

  @Post(':id')
  upsert(
    @Param('id') id: string,
    @Body() updateAssetDto: UpsertAssetDto,
    @User('id') owner,
  ) {
    return this.assetsService.upsert(owner, id, updateAssetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('id') owner) {
    return this.assetsService.remove(owner, id);
  }
}
