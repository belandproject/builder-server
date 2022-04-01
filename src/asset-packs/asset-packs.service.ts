import { Injectable } from '@nestjs/common';
import { CreateAssetPackDto } from './dto/create-asset-pack.dto';
import { UpdateAssetPackDto } from './dto/update-asset-pack.dto';

@Injectable()
export class AssetPacksService {
  create(createAssetPackDto: CreateAssetPackDto) {
    return 'This action adds a new assetPack';
  }

  findAll() {
    return `This action returns all assetPacks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assetPack`;
  }

  update(id: number, updateAssetPackDto: UpdateAssetPackDto) {
    return `This action updates a #${id} assetPack`;
  }

  remove(id: number) {
    return `This action removes a #${id} assetPack`;
  }
}
