import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PaginateQuery } from 'src/common/paginate/decorator';
import { paginate } from 'src/common/paginate/paginate';
import { UpsertAssetPackDto } from './dto/upsert-asset-pack.dto';
import { AssetPack } from './entities/asset-pack.entity';

@Injectable()
export class AssetPacksService {
  constructor(
    @InjectModel(AssetPack)
    private assetPackModel: typeof AssetPack,
  ) {}

  findAll(owner: string, query: PaginateQuery) {
    const where: { owner: string } = { owner: owner ? owner : '' };
    if (query.filter && query.filter.owner == 'default') {
      where.owner = 'default';
    } else if (!owner) {
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

  findOne(id: string) {
    return this.assetPackModel.findByPk(id);
  }

  async upsert(owner: string, id: string, upsertData: UpsertAssetPackDto) {
    const pack = await this.assetPackModel.findByPk(id);
    if (!pack) {
      return this.assetPackModel.create({
        ...upsertData,
        owner,
        id,
      });
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
