import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Asset } from 'src/assets/entities/asset.entity';
import { PaginateQuery } from 'src/common/paginate/decorator';
import { paginate } from 'src/common/paginate/paginate';
import { StorageService } from 'src/storage/storage.service';
import { ListAssetPackResponseDto } from './dto/list-asset-pack-response.dto';
import { UpsertAssetPackDto } from './dto/upsert-asset-pack.dto';
import { AssetPack } from './entities/asset-pack.entity';
import * as mine from 'mime-types';

const THUMBNAIL_FILE_NAME = 'thumbnail';

@Injectable()
export class AssetPacksService {
  constructor(
    @InjectModel(AssetPack)
    private assetPackModel: typeof AssetPack,
    @InjectModel(Asset)
    private assetModel: typeof Asset,
    private readonly storageService: StorageService,
  ) {}

  findAll(
    owner: string,
    query: PaginateQuery,
  ): Promise<ListAssetPackResponseDto> {
    const where: { owner: string } = { owner: owner ? owner : '' };
    if (query.filter && query.filter.owner == 'default') {
      where.owner = process.env.DEFAULT_ASSET_PACK_ADDRESS;
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
    const pack = await this.assetPackModel.findByPk(id, {
      include: ['assets'],
    });
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
    if (upsertData.assets && upsertData.assets.length > 0) {
      await this.assetModel.destroy({ where: { pack_id: pack.id } });
      await this.assetModel.bulkCreate(
        upsertData.assets.map((asset) => {
          return {
            ...asset,
            pack_id: pack.id,
            owner,
          };
        }),
      );
    }
    await pack.save();
    return pack;
  }

  async remove(owner, id: string) {
    const deletedCount = await this.assetPackModel.destroy({
      where: { id, owner },
    });
    if (deletedCount > 0) {
      await this.storageService.delete(`asset-packs/${id}`);
    }
    return deletedCount;
  }

  async fileUpload(file: Express.Multer.File, owner: string, id: string) {
    const pack = await this.assetPackModel.findOne({
      where: { id, owner },
      attributes: ['id'],
    });
    if (!pack) throw new NotFoundException(`asset pack ${id} not found`);

    await this.storageService.upload(
      file,
      (file: Express.Multer.File): string => {
        const extension = mine.extension(file.mimetype);
        const filename = `${file.fieldname}.${extension}`;
        return `asset-packs/${id}/${filename}`;
      },
    );

    const extension = mine.extension(file.mimetype);
    await this.assetPackModel.update(
      { thumbnail: `${THUMBNAIL_FILE_NAME}.${extension}` },
      { where: { id }, returning: false },
    );
  }
}
