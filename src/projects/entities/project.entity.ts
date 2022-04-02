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

@Table({ tableName: 'projects' })
export class Project extends Model {
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
  thumbnail: boolean;

  @AllowNull(false)
  @Column
  owner: string;

  @AllowNull(false)
  @Column
  cols: number;

  @AllowNull(false)
  @Column
  rows: number;

  @Default(false)
  @Column
  is_published: boolean;

  @Column(JSONB)
  scene: any;

  @Column
  creation_coords: string;

  @Column
  parcels: number;

  @Column
  transforms: number;

  @Column
  scripts: number;

  @Column
  entities: number;

  @Column
  gltf_shapes: number;

  @Column
  nft_shapes: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
