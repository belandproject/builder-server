import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'src/common/paginate/decorator';
import { User } from 'src/common/user.decorator';
import { CollectionsService } from './collections.service';
import { UpsertCollectionDto } from './dto/upsert-collection.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  findAll(@Paginate() query: PaginateQuery, @Request() req) {
    query.filter.owner = req.user.id;
    return this.collectionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionsService.findOne(id);
  }

  @Post(':id')
  upsert(
    @Param('id') id: string,
    @Body() data: UpsertCollectionDto,
    @User('id') userId,
  ) {
    return this.collectionsService.upsert(userId, id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('id') userId) {
    return this.collectionsService.remove(userId, id);
  }
}
