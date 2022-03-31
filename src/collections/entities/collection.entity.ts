import { ARRAY } from 'sequelize';
import { STRING } from 'sequelize';
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
  eth_address: string;

  @AllowNull(false)
  @Column
  salt: string;

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

  @Column
  reviewed_at: Date;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
