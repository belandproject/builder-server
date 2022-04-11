import { ARRAY } from 'sequelize';
import { STRING } from 'sequelize';
import {
  AllowNull,
  BelongsToMany,
  Column,
  CreatedAt,
  Default,
  HasMany,
  Index,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { Item } from 'src/items/entities/item.entity';

@Table({ tableName: 'collections' })
export class Collection extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  symbol: string;

  @Column
  urn: string;

  @Index
  @AllowNull(false)
  @Column
  owner: string;

  @HasMany(() => Item)
  items: Item[];

  @Unique
  @Index
  @AllowNull(false)
  @Column
  contract_address: string;

  @Default(false)
  @Column
  is_published: boolean;

  @Default(false)
  @Column
  is_approved: boolean;

  @Column(ARRAY(STRING))
  minters: Array<string>;

  @Column
  locked_at: Date;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
