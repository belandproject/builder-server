import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { PaginateQuery } from 'src/common/paginate/decorator';
import { paginate } from 'src/common/paginate/paginate';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item)
    private itemModel: typeof Item,
  ) {}

  create(authId: string, createItemDto: CreateItemDto) {
    return this.itemModel.create({ ...createItemDto, eth_address: authId });
  }

  findAll(query: PaginateQuery) {
    return paginate(query, this.itemModel, {
      sortableColumns: ['id'],
      searchableColumns: [],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        id: [],
        eth_address: [Op.in],
      },
    });
  }

  findOne(id: number) {
    return this.itemModel.findByPk(id);
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return this.itemModel.update(updateItemDto, { where: { id: id } });
  }

  remove(id: number) {
    return this.itemModel.destroy({ where: { id } });
  }
}
