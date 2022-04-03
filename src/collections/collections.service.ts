import { Injectable, NotFoundException } from '@nestjs/common';
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
import { UpsertCollectionDto } from './dto/upsert-collection.dto';
import { Collection } from './entities/collection.entity';

@Injectable()
export class CollectionsService {
  public factoryAddress;
  public initCodeHash;

  constructor(
    @InjectModel(Collection)
    private collectionModel: typeof Collection,
    private configService: ConfigService,
  ) {
    this.factoryAddress = this.configService.get('NFT_FACTORY');
    this.initCodeHash = this.configService.get('NFT_INIT_CODE_HASH');
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
    collection.setAttributes(data);
    return collection.save();
  }

  findAll(owner, query: PaginateQuery) {
    return paginate(query, this.collectionModel, {
      maxLimit: 1000,
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
