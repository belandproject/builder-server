import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'src/common/paginate/decorator';
import { User } from 'src/common/user.decorator';
import { AssetsService } from './assets.service';
import { UpsertAssetDto } from './dto/upsert-asset.dto';

@ApiTags('Assets')
@ApiBearerAuth()
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  findAll(@Paginate() query: PaginateQuery, @User('id') userId) {
    return this.assetsService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User('id') userId) {
    return this.assetsService.findOne(userId, id);
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
