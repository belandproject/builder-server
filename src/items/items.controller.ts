import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Paginate, PaginateQuery } from 'src/common/paginate/decorator';
import { User } from 'src/common/user.decorator';
import { UpsertItemDto } from './dto/upsert-item.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(@Paginate() query: PaginateQuery, @User('id') userId) {
    return this.itemsService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User('id') userId) {
    return this.itemsService.findOne(userId, id);
  }

  @Post(':id')
  async upsert(
    @Param('id') id: string,
    @Body() upsertData: UpsertItemDto,
    @User('id') userId,
  ) {
    return this.itemsService.upsert(userId, id, upsertData);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('id') userId) {
    return this.itemsService.remove(userId, id);
  }
}
