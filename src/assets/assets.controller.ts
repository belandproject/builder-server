import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'src/common/paginate/decorator';
import { User } from 'src/common/user.decorator';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  create(@Body() createAssetDto: CreateAssetDto, @User('id') owner) {
    return this.assetsService.create(owner, createAssetDto);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.assetsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssetDto: UpdateAssetDto,
    @User('id') owner,
  ) {
    return this.assetsService.update(owner, id, updateAssetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('id') owner) {
    return this.assetsService.remove(owner, id);
  }
}
