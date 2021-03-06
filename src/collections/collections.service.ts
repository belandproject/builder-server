import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import {
  getCreate2Address,
  solidityKeccak256,
  solidityPack,
} from 'ethers/lib/utils';
import { Op } from 'sequelize';
import { PaginateQuery } from 'src/common/paginate/decorator';
import { paginate } from 'src/common/paginate/paginate';
import { Item } from 'src/items/entities/item.entity';
import { ListCollectionResponseDto } from './dto/list-collection-response.dto';
import { UpsertCollectionDto } from './dto/upsert-collection.dto';
import { Collection } from './entities/collection.entity';

@Injectable()
export class CollectionsService {
  public factoryAddress;
  public initCodeHash;
  public hub;

  constructor(
    @InjectModel(Collection)
    private collectionModel: typeof Collection,
    @InjectModel(Item)
    private itemModel: typeof Item,
    private configService: ConfigService,
  ) {
    this.factoryAddress = this.configService.get('NFT_FACTORY');
    this.initCodeHash = this.configService.get('NFT_INIT_CODE_HASH');
    this.hub = this.configService.get('HUB_ENDPOINT');
  }

  async lock(owner: string, id: string) {
    const lockedAt = new Date();
    const [affectedCount] = await this.collectionModel.update(
      {
        locked_at: lockedAt,
      },
      {
        where: {
          id,
          owner,
          locked_at: null,
        },
      },
    );

    if (affectedCount == 0) throw new BadRequestException('cannot lock');
    return {
      id: id,
      locked_at: lockedAt,
    };
  }

  async upsert(owner: string, id: string, data: UpsertCollectionDto) {
    const collection = await this.collectionModel.findByPk(id);
    if (!collection) {
      return this.collectionModel.create({
        ...data,
        id,
        contract_address: computeCollectionAddress(
          this.factoryAddress,
          this.initCodeHash,
          data.name,
          data.symbol,
          owner,
        ),
        owner,
      });
    }

    if (collection.owner != owner || collection.locked_at != null) {
      throw new UnauthorizedException('cannot update collection');
    }

    collection.setAttributes(data);
    return collection.save();
  }

  async findAll(
    owner,
    query: PaginateQuery,
  ): Promise<ListCollectionResponseDto> {
    const data: any = await paginate(query, this.collectionModel, {
      maxLimit: 100,
      defaultLimit: 30,
      where: { owner },
      sortableColumns: ['id'],
      searchableColumns: [],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        id: [],
        owner: [Op.in],
      },
    });
    const collectionIds: string[] = data.rows.map(
      (row) => row.contract_address,
    );
    const remoteCollections: { rows: any[] } = await fetch(
      `${this.hub}/collections?id__in=${collectionIds.join(',')}&limit=${collectionIds.length}`,
    ).then((res) => res.json());
    const remoteCollectionById = {};
    for (const col of remoteCollections.rows) {
      remoteCollectionById[col.id] = col;
    }

    data.rows = data.rows.map((row) => {
      const remote = remoteCollectionById[row.contract_address];
      if (remote) {
        row.is_published = true;
        row.is_approved = remote.isApproved;
        row.minters = remote.minters;
      }
      return row;
    });

    return data as any;
  }

  async findOne(owner: string, id: string) {
    const collection = await this.collectionModel.findOne({
      where: { owner, id },
    });
    if (!collection) throw new NotFoundException('collection not found');
    return collection;
  }

  async remove(owner: string, id: string) {
    await this.collectionModel.destroy({
      where: { id, owner, is_published: false, locked_at: null },
    });
  }

  async sync(id: string) {
    const dbCol = await this.collectionModel.findByPk(id);
    if (!dbCol) throw new NotFoundException('collection not found');

    const removeCol = await fetch(
      `${this.hub}/collections/${dbCol.contract_address}`,
    ).then((res) => res.json());

    const dbItems = await this.itemModel.findAll({
      where: {
        collection_id: id,
      },
      order: [['created_at', 'ASC']],
    });

    dbCol.is_published = true;
    dbCol.is_approved = removeCol.isApproved;
    await dbCol.save();

    const isNotSynced = dbItems.some((item) => !item.blockchain_item_id);
    if (isNotSynced) {
      const hubItems: { rows: any[] } = await fetch(
        `${this.hub}/items?tokenAddress=${dbCol.contract_address}&limit=1000`,
      ).then((res) => res.json());

      const updates = [];
      for (let i = 0; i < dbItems.length; i++) {
        const hubItem = hubItems.rows.find(
          (remoteItem) => Number(remoteItem.itemId) === i,
        );
        if (!hubItem) {
          throw new BadRequestException('UnpublishedItem');
        }
        dbItems[i].blockchain_item_id = hubItem.itemId;
        dbItems[i].token_address = hubItem.tokenAddress;
        updates.push(dbItems[i].save());
      }
      await Promise.all(updates);
    }

    return {
      collection: dbCol,
      items: dbItems,
    };
  }
}

export const computeCollectionAddress = (
  factoryAddress,
  nftInitHash,
  name,
  symbol,
  creator,
) => {
  return getCreate2Address(
    factoryAddress,
    solidityKeccak256(
      ['bytes'],
      [solidityPack(['string', 'string', 'address'], [name, symbol, creator])],
    ),
    nftInitHash,
  );
};
