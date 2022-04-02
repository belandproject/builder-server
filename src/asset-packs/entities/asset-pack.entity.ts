import {
  AllowNull,
  Column,
  CreatedAt,
  HasMany,
  Index,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Asset } from 'src/assets/entities/asset.entity';

@Table({ tableName: 'asset_packs' })
export class AssetPack extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @Index
  @AllowNull(false)
  @Column
  owner: string;

  @AllowNull(false)
  @Column
  name: string;

  @Column
  thumbnail: boolean;

  @HasMany(() => Asset)
  assets: Asset[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
