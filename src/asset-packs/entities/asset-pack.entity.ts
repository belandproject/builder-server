import { ARRAY } from 'sequelize';
import { JSONB } from 'sequelize';
import { STRING } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  Index,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

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
  title: string;

  @Column
  thumbnail: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
