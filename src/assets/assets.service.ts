import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { PaginateQuery } from 'src/common/paginate/decorator';
import { paginate } from 'src/common/paginate/paginate';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';

@Injectable()
export class AssetsService {
  constructor(
    @InjectModel(Asset)
    private assetModel: typeof Asset,
  ) {}

  create(ownerId: string, createAssetDto: CreateAssetDto) {
    return this.assetModel.create({ ...createAssetDto, owner: ownerId });
  }

  findAll(query: PaginateQuery) {
    return paginate(query, this.assetModel, {
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
    return this.assetModel.findByPk(id);
  }

  update(id: string, updateAssetDto: UpdateAssetDto) {
    return this.assetModel.update(updateAssetDto, { where: { id } });
  }

  remove(id: string) {
    return this.assetModel.destroy({ where: { id } });
  }
}
