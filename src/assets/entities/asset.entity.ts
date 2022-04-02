import { ARRAY } from 'sequelize';
import { JSONB } from 'sequelize';
import { STRING } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Index,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { AssetPack } from 'src/asset-packs/entities/asset-pack.entity';

@Table({ tableName: 'assets' })
export class Asset extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @AllowNull(false)
  @Column
  name: string;

  @ForeignKey(() => AssetPack)
  @Index
  @IsUUID(4)
  @AllowNull(false)
  @Column
  pack_id: string;

  @BelongsTo(() => AssetPack)
  pack: AssetPack;

  @Index
  @AllowNull(false)
  @Column
  owner: string;

  @AllowNull(false)
  @Column
  model: string;

  @Column
  script: string;

  @Column
  thumbnail: boolean;

  @Column(ARRAY(STRING))
  tags: Array<string>;

  @Column
  category: string;

  @Column(JSONB)
  metrics: Record<string, string>;

  @Column(JSONB)
  contents: Record<string, string>;

  @Column(JSONB)
  parameters: any;

  @Column(JSONB)
  actions: any;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
