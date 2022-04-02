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
import { User } from 'src/common/user.decorator';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  create(@Body() createCollectionDto: CreateCollectionDto, @Request() req) {
    return this.collectionsService.create(req.user.id, createCollectionDto);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery, @Request() req) {
    query.filter.owner = req.user.id;
    return this.collectionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
    @User('id') userId,
  ) {
    return this.collectionsService.update(userId, id, updateCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('id') userId) {
    return this.collectionsService.remove(userId, id);
  }
}
