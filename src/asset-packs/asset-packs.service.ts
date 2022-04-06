import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Asset } from 'src/assets/entities/asset.entity';
import { PaginateQuery } from 'src/common/paginate/decorator';
import { paginate } from 'src/common/paginate/paginate';
import { ListAssetPackResponseDto } from './dto/list-asset-pack-response.dto';
import { UpsertAssetPackDto } from './dto/upsert-asset-pack.dto';
import { AssetPack } from './entities/asset-pack.entity';

@Injectable()
export class AssetPacksService {
  constructor(
    @InjectModel(AssetPack)
    private assetPackModel: typeof AssetPack,
    @InjectModel(Asset)
    private assetModel: typeof Asset,
  ) {}

  findAll(
    owner: string,
    query: PaginateQuery,
  ): Promise<ListAssetPackResponseDto> {
    const where: { owner: string } = { owner: owner ? owner : '' };
    if (query.filter && query.filter.owner == 'default') {
      where.owner = 'default';
    } else if (!owner || owner != query.filter.owner) {
      throw new UnauthorizedException('Unauthorized');
    }
    return paginate(query, this.assetPackModel, {
      sortableColumns: ['id'],
      searchableColumns: [],
      defaultSortBy: [['id', 'DESC']],
      include: ['assets'],
      where,
      filterableColumns: {
        id: [],
        owner: [],
      },
    });
  }

  async findOne(owner: string, id: string) {
    const pack = await this.assetPackModel.findOne({ where: { owner, id } });
    if (!pack) throw new NotFoundException('asset pack not found');
    return pack;
  }

  async upsert(owner: string, id: string, upsertData: UpsertAssetPackDto) {
    const pack = await this.assetPackModel.findByPk(id);
    const assets = upsertData.assets
      ? upsertData.assets.map((asset) => {
          return { ...asset, owner, pack_id: id };
        })
      : [];

    if (!pack) {
      return this.assetPackModel.create(
        {
          ...upsertData,
          owner,
          assets,
          id,
        },
        { include: ['assets'] },
      );
    }
    if (pack.owner != owner) {
      throw new UnauthorizedException('cannot edit asset pack');
    }

    pack.setAttributes(upsertData);

    await pack.save();
    return pack;
  }

  remove(owner, id: string) {
    return this.assetPackModel.destroy({ where: { id, owner } });
  }
}
