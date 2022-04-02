import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Collection } from 'src/collections/entities/collection.entity';
import { PaginateQuery } from 'src/common/paginate/decorator';
import { paginate } from 'src/common/paginate/paginate';
import { UpsertItemDto } from './dto/upsert-item.dto';
import { Item, ItemType } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item)
    private itemModel: typeof Item,
    @InjectModel(Collection)
    private collectionModel: typeof Collection,
  ) {}

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

  async _canAddItem(id: string, owner: string) {
    const collection = await this.collectionModel.findOne({
      where: { id, owner, is_published: false, locked_at: null },
    });

    if (!collection)
      throw new HttpException(
        `collection ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    return collection;
  }

  async upsert(owner: string, id: string, upsertData: UpsertItemDto) {
    const data =
      upsertData.type === ItemType.EMOTE
        ? upsertData.emote
        : upsertData.wearable;

    const item = await this.itemModel.findOne({ where: { id } });
    if (!item) {
      await this._canAddItem(upsertData.collection_id, owner);
      return this.itemModel.create({ ...upsertData, owner, id, data });
    }

    if (item.owner != owner) {
      throw new HttpException('cannot edit item', HttpStatus.UNAUTHORIZED);
    }

    if (
      upsertData.collection_id &&
      item.collection_id != upsertData.collection_id
    ) {
      await this._canAddItem(upsertData.collection_id, owner);
    }

    item.setAttributes({ ...upsertData, data });
    return item;
  }

  remove(owner: string, id: string) {
    return this.itemModel.destroy({ where: { id, owner } });
  }
}
