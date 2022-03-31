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

@Table({ tableName: 'projects' })
export class Project extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @AllowNull(true)
  @Column
  title: string;

  @Column
  description: string;

  @AllowNull(true)
  @Column
  thumbnail: boolean;

  @IsUUID(4)
  @Column
  scene_id: string;

  @AllowNull(true)
  @Column
  eth_address: string;

  @AllowNull(true)
  @Column
  cols: number;

  @AllowNull(true)
  @Column
  rows: number;

  @Default(false)
  @Column
  is_published: boolean;

  @Column
  creation_coords: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
