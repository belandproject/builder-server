import { ARRAY } from 'sequelize';
import { STRING } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  Default,
  Index,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

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

  @Index
  @AllowNull(false)
  @Column
  owner: string;

  @AllowNull(false)
  @Column
  salt: string;

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
