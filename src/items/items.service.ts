import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Collection } from 'src/collections/entities/collection.entity';
import { PaginateQuery } from 'src/common/paginate/decorator';
import { paginate } from 'src/common/paginate/paginate';
import { ListItemResponseDto } from './dto/list-item-response.dto';
import { UpsertItemDto } from './dto/upsert-item.dto';
import { Item } from './entities/item.entity';
import * as _ from 'lodash';

@Injectable()
export class ItemsService {
  public hub: string;
  constructor(
    @InjectModel(Item)
    private itemModel: typeof Item,
    @InjectModel(Collection)
    private collectionModel: typeof Collection,
    private configSrv: ConfigService,
  ) {
    this.hub = this.configSrv.get('HUB_ENDPOINT');
  }

  async findAll(
    owner: string,
    query: PaginateQuery,
  ): Promise<ListItemResponseDto> {
    const data: any = await paginate(query, this.itemModel, {
      sortableColumns: ['id'],
      searchableColumns: [],
      where: { owner },
      defaultSortBy: [['id', 'DESC']],
      defaultLimit: 1000,
      maxLimit: 1000,
      filterableColumns: {
        id: [],
        owner: [],
        collection_id: [],
      },
    });

    const [rItems, rCollections] = await Promise.all([
      this._getRemoteItems(data.rows),
      this._getRemoteCollections(data.rows),
    ]);
    data.rows = await this._mergeItems(data.rows, rItems, rCollections);
    return data;
  }

  async _getRemoteCollections(items) {
    const ids: string[] = items
      .filter((r) => r.token_address != '')
      .map((row) => row.token_address);
    const res: { rows: any[] } = await fetch(
      `${this.hub}/collections?id__in=${ids.join(',')}&limit=${ids.length}`,
    ).then((res) => res.json());
    return res.rows;
  }

  async _getRemoteItems(items) {
    const itemIds: string[] = items
      .filter((r) => r.token_address != '')
      .map((row) => row.token_address + '-' + row.blockchain_item_id);
    const res: { rows: any[] } = await fetch(
      `${this.hub}/items?id__in=${itemIds.join(',')}&limit=${itemIds.length}`,
    ).then((res) => res.json());
    return res.rows;
  }

  _mergeItems(dbItems, remoteItems, rCollections) {
    const byId: any = _.keyBy(remoteItems, 'id');
    const colById: any = _.keyBy(rCollections, 'id');
    return dbItems.map((item) => {
      item = item.toJSON();
      const remote = byId[item.token_address + '-' + item.blockchain_item_id];
      if (remote) {
        item.is_published = true;
        item.is_approved = colById[item.token_address].isApproved;
        item.total_supply = remote.totalSupply;
        item.price = remote.pricePerUnit;
        item.on_sale = remote.onSale;
        item.blockchain_item_id = String(item.blockchain_item_id);
      }
      return item;
    });
  }

  async findOne(owner: string, id: string) {
    const item = await this.itemModel.findOne({ where: { owner, id } });
    if (!item) throw new NotFoundException('item not found');
    return item;
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
    upsertData.type = upsertData.data.__type;
    const item = await this.itemModel.findOne({ where: { id } });
    if (!item) {
      if (upsertData.collection_id) {
        await this._canAddItem(upsertData.collection_id, owner);
      }

      return this.itemModel.create({
        ...upsertData,
        owner,
        id,
      });
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

    item.setAttributes({ ...upsertData });
    await item.save();
    return item;
  }

  async remove(owner: string, id: string) {
    const item = await this.itemModel.findOne({ where: { owner, id } });
    if (!item) throw new NotFoundException('item not found');
    if (item.collection_id) {
      await this._canAddItem(item.collection_id, owner);
    }
    return item.destroy();
  }
}
