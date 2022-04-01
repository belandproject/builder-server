import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Put,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'src/common/paginate/decorator';
import { AssetPacksService } from './asset-packs.service';
import { CreateAssetPackDto } from './dto/create-asset-pack.dto';
import { UpdateAssetPackDto } from './dto/update-asset-pack.dto';

@Controller('asset-packs')
export class AssetPacksController {
  constructor(private readonly assetPacksService: AssetPacksService) {}

  @Post()
  create(@Body() createAssetPackDto: CreateAssetPackDto, @Request() req) {
    return this.assetPacksService.create(req.user.id, createAssetPackDto);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.assetPacksService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetPacksService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssetPackDto: UpdateAssetPackDto,
  ) {
    return this.assetPacksService.update(id, updateAssetPackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetPacksService.remove(id);
  }
}
