import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AssetPack } from 'src/asset-packs/entities/asset-pack.entity';
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
    @InjectModel(AssetPack)
    private assetPack: typeof AssetPack,
  ) {}

  async create(owner: string, createAssetDto: CreateAssetDto) {
    const assetPack = await this.assetModel.findOne({
      where: { id: createAssetDto.pack_id, owner },
    });
    if (!assetPack) {
      throw new HttpException(
        `asset pack ${createAssetDto.pack_id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return this.assetModel.create({ ...createAssetDto, owner });
  }

  findAll(query: PaginateQuery) {
    return paginate(query, this.assetModel, {
      sortableColumns: ['id'],
      searchableColumns: [],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        id: [],
        owner: [],
        pack_id: [],
      },
    });
  }

  findOne(id: string) {
    return this.assetModel.findByPk(id);
  }

  async update(owner: string, id: string, updateAssetDto: UpdateAssetDto) {
    const asset = await this.assetModel.findOne({ where: { id, owner } });
    if (!asset) {
      throw new HttpException(`asset ${id} not found`, HttpStatus.NOT_FOUND);
    }

    if (updateAssetDto.pack_id && asset.pack_id != updateAssetDto.pack_id) {
      const assetPack = await this.assetModel.findOne({ where: { id, owner } });
      if (!assetPack) {
        throw new HttpException(
          `asset pack ${updateAssetDto.pack_id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
    }
    asset.setAttributes(updateAssetDto);
    await asset.save();
    return asset;
  }

  remove(owner: string, id: string) {
    return this.assetModel.destroy({ where: { id, owner } });
  }
}
