import { AssetPack } from '../entities/asset-pack.entity';

export class ListAssetPackResponseDto {
  rows: AssetPack[];
  count: number;
}
