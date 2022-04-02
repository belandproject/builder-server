import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Request,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Paginate, PaginateQuery } from 'src/common/paginate/decorator';
import { User } from 'src/common/user.decorator';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto, @Request() req) {
    return this.itemsService.create(req.user.id, createItemDto);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery, @Request() req) {
    query.filter.owner = req.user.id;
    return this.itemsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @User('id') userId,
  ) {
    return this.itemsService.update(userId, id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('id') userId) {
    return this.itemsService.remove(userId, id);
  }
}
