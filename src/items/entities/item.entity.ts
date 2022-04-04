import { JSONB } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  Index,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Collection } from 'src/collections/entities/collection.entity';
import { EmoteData, WearableData } from '../dto/upsert-item.dto';

@Table({ tableName: 'items' })
export class Item extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @AllowNull(false)
  @Column
  name: string;

  @Column
  description: string;

  @Column
  thumbnail: string;

  @Index
  @AllowNull(false)
  @Column
  owner: string;

  @Index
  @ForeignKey(() => Collection)
  @AllowNull(false)
  @IsUUID(4)
  @Column
  collection_id: string;

  @BelongsTo(() => Collection)
  collection: Collection;

  @Column
  blockchain_item_id: number;

  @Default(0)
  @Column
  total_supply: number;

  @Column
  content_hash: string;

  @Default(0)
  @Column
  price: string;

  @Column
  beneficiary: string;

  @Column
  rarity: ItemRarity;

  @Column
  type: ItemType;

  @Column(JSONB)
  data: EmoteData | WearableData;

  @Column(JSONB)
  metrics: MetricsAttributes;

  @Column(JSONB)
  contents: Map<string, string>;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

export enum ItemType {
  WEARABLE = 'wearable',
  EMOTE = 'emote',
}
export enum ItemRarity {
  UNIQUE = 'unique',
  MYTHIC = 'mythic',
  LEGENDARY = 'legendary',
  EPIC = 'epic',
  RARE = 'rare',
  UNCOMMON = 'uncommon',
  COMMON = 'common',
}

export type Contents = Record<string, string>;

export type MetricsAttributes = {
  meshes: number;
  bodies: number;
  materials: number;
  textures: number;
  triangles: number;
  entities: number;
};
