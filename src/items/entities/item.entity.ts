import { JSONB } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  Default,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

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

  @AllowNull(false)
  @Column
  thumbnail: string;

  @AllowNull(false)
  @Column
  eth_address: string;

  @AllowNull(false)
  @IsUUID(4)
  @Column
  collection_id: string;

  @AllowNull
  @Column
  blockchain_item_id: number;

  @Default(0)
  @Column
  total_supply: number;

  @AllowNull(false)
  @Column
  content_hash: string;

  @Default(0)
  @Column
  price: string;

  @AllowNull
  @Column
  beneficiary: string;

  @Column
  rarity: ItemRarity;

  @Column
  type: ItemType;

  @Column(JSONB)
  data: any;

  @Column(JSONB)
  metrics: MetricsAttributes;

  @Column(JSONB)
  contents: Contents;

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
