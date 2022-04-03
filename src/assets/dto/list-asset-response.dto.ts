import { Asset } from '../entities/asset.entity';

export class ListAssetResponseDto {
  rows: Asset[];
  count: number;
}
