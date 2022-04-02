import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import {
  getCreate2Address,
  keccak256,
  solidityKeccak256,
  solidityPack,
} from 'ethers/lib/utils';
import { Op } from 'sequelize';
import { PaginateQuery } from 'src/common/paginate/decorator';
import { paginate } from 'src/common/paginate/paginate';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
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

  create(ownerId: string, createCollectionDto: CreateCollectionDto) {
    return this.collectionModel.create({
      ...createCollectionDto,
      contract_address: computeCollectionAddress(
        this.factoryAddress,
        this.initCodeHash,
        createCollectionDto.name,
        createCollectionDto.symbol,
        ownerId,
      ),
      owner: ownerId,
    });
  }

  findAll(query: PaginateQuery) {
    return paginate(query, this.collectionModel, {
      sortableColumns: ['id'],
      searchableColumns: [],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        id: [],
        owner: [Op.in],
      },
    });
  }

  findOne(id: string) {
    return this.collectionModel.findByPk(id);
  }

  update(owner: string, id: string, updateCollectionDto: UpdateCollectionDto) {
    return this.collectionModel.update(updateCollectionDto, {
      where: { id, owner, is_published: false, locked_at: null },
    });
  }

  remove(owner: string, id: string) {
    return this.collectionModel.destroy({ where: { id, owner } });
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
