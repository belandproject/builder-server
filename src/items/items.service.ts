import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Collection } from 'src/collections/entities/collection.entity';
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
    @InjectModel(Collection)
    private collectionModel: typeof Collection,
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
        owner: [],
        collection_id: [],
      },
    });
  }

  findOne(id: string) {
    return this.itemModel.findByPk(id);
  }

  async update(owner: string, id: string, updateItemDto: UpdateItemDto) {
    const item = await this.itemModel.findOne({ where: { id, owner } });
    if (!item) {
      throw new HttpException(`item ${id} not found`, HttpStatus.NOT_FOUND);
    }
    const collectionId = updateItemDto.collection_id || item.collection_id;
    const collection = await this.collectionModel.findOne({
      where: { id: collectionId, owner },
    });

    if (!collection)
      throw new HttpException(
        `collection ${collectionId} not found`,
        HttpStatus.NOT_FOUND,
      );

    return this.itemModel.update(updateItemDto, { where: { id, owner } });
  }

  remove(owner: string, id: string) {
    return this.itemModel.destroy({ where: { id, owner } });
  }
}
