import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'src/common/paginate/decorator';
import { User } from 'src/common/user.decorator';
import { CollectionsService } from './collections.service';
import { UpsertCollectionDto } from './dto/upsert-collection.dto';

@ApiBearerAuth()
@ApiTags('Collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  findAll(@Paginate() query: PaginateQuery, @User('id') userId) {
    return this.collectionsService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User('id') userId) {
    return this.collectionsService.findOne(userId, id);
  }

  @Post(':id')
  upsert(
    @Param('id') id: string,
    @Body() data: UpsertCollectionDto,
    @User('id') userId,
  ) {
    return this.collectionsService.upsert(userId, id, data);
  }

  @Post(':id/lock')
  lock(@Param('id') id: string, @User('id') userId) {
    return this.collectionsService.lock(userId, id);
  }

  @Post(':id/sync')
  sync(@Param('id') id: string) {
    return this.collectionsService.sync(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('id') userId) {
    return this.collectionsService.remove(userId, id);
  }
}
