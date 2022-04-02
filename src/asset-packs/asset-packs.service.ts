import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { UpdateAssetDto } from 'src/assets/dto/update-asset.dto';
import { PaginateQuery } from 'src/common/paginate/decorator';
import { paginate } from 'src/common/paginate/paginate';
import { CreateAssetPackDto } from './dto/create-asset-pack.dto';
import { UpdateAssetPackDto } from './dto/update-asset-pack.dto';
import { AssetPack } from './entities/asset-pack.entity';

@Injectable()
export class AssetPacksService {
  constructor(
    @InjectModel(AssetPack)
    private assetPackModel: typeof AssetPack,
  ) {}

  create(ownerId: string, createAssetPackDto: CreateAssetPackDto) {
    return this.assetPackModel.create({
      ...createAssetPackDto,
      owner: ownerId,
    });
  }

  findAll(query: PaginateQuery) {
    return paginate(query, this.assetPackModel, {
      sortableColumns: ['id'],
      searchableColumns: [],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        id: [],
        owner: [],
      },
    });
  }

  findOne(id: string) {
    return this.assetPackModel.findByPk(id);
  }

  update(id: string, updateAssetPackDto: UpdateAssetPackDto) {
    return this.assetPackModel.update(updateAssetPackDto, { where: { id } });
  }

  remove(id: string) {
    return this.assetPackModel.destroy({ where: { id } });
  }
}
