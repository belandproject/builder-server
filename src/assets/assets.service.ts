import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AssetPack } from 'src/asset-packs/entities/asset-pack.entity';
import { PaginateQuery } from 'src/common/paginate/decorator';
import { paginate } from 'src/common/paginate/paginate';
import { ListAssetResponseDto } from './dto/list-asset-response.dto';
import { UpsertAssetDto } from './dto/upsert-asset.dto';
import { Asset } from './entities/asset.entity';

@Injectable()
export class AssetsService {
  constructor(
    @InjectModel(Asset)
    private assetModel: typeof Asset,
    @InjectModel(AssetPack)
    private assetPack: typeof AssetPack,
  ) {}

  findAll(owner, query: PaginateQuery): Promise<ListAssetResponseDto> {
    return paginate(query, this.assetModel, {
      sortableColumns: ['id'],
      searchableColumns: [],
      defaultSortBy: [['id', 'DESC']],
      where: { owner },
      filterableColumns: {
        id: [],
        owner: [],
        pack_id: [],
      },
    });
  }

  async findOne(owner: string, id: string) {
    const pack = await this.assetModel.findOne({ where: { owner, id } });
    if (!pack) throw new NotFoundException('asset not found');
    return pack;
  }

  async _canEdit(owner: string, id: string) {
    const pack = await this.assetPack.findOne({
      where: { id, owner },
    });

    if (!pack)
      throw new HttpException(
        `asset pack ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    return pack;
  }

  async upsert(owner: string, id: string, upsertData: UpsertAssetDto) {
    const asset = await this.assetModel.findOne({ where: { id } });
    if (!asset) {
      await this._canEdit(owner, upsertData.pack_id);
      return this.assetModel.create({ ...upsertData, id, owner });
    }

    if (asset.owner != owner) {
      throw new UnauthorizedException('cannot edit asset');
    }

    if (upsertData.pack_id && asset.pack_id != upsertData.pack_id) {
      await this._canEdit(owner, upsertData.pack_id);
    }
    asset.setAttributes(upsertData);
    await asset.save();
    return asset;
  }

  remove(owner: string, id: string) {
    return this.assetModel.destroy({ where: { id, owner } });
  }
}
