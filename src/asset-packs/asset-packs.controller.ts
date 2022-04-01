import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssetPacksService } from './asset-packs.service';
import { CreateAssetPackDto } from './dto/create-asset-pack.dto';
import { UpdateAssetPackDto } from './dto/update-asset-pack.dto';

@Controller('asset-packs')
export class AssetPacksController {
  constructor(private readonly assetPacksService: AssetPacksService) {}

  @Post()
  create(@Body() createAssetPackDto: CreateAssetPackDto) {
    return this.assetPacksService.create(createAssetPackDto);
  }

  @Get()
  findAll() {
    return this.assetPacksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetPacksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssetPackDto: UpdateAssetPackDto) {
    return this.assetPacksService.update(+id, updateAssetPackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetPacksService.remove(+id);
  }
}
