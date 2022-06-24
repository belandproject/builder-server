import { Exclude, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export enum ParameterType {
  BOOLEAN = 'boolean',
  TEXT = 'text',
  FLOAT = 'float',
  INTEGER = 'integer',
  ENTITY = 'entity',
  ACTIONS = 'actions',
  OPTIONS = 'options',
  TEXTAREA = 'textarea',
  SLIDER = 'slider',
}

export class AssetMetric {
  @IsNumber()
  triangles: number;
  @IsNumber()
  materials: number;
  @IsNumber()
  textures: number;
  @IsNumber()
  meshes: number;
  @IsNumber()
  bodies: number;
  @IsNumber()
  entities: number;
}

export class UpsertAssetDto {
  @IsString()
  name: string;

  @IsUUID(4)
  pack_id: string;

  @IsString()
  model: string;

  @IsOptional()
  @IsString()
  script: string;

  @Exclude()
  owner: string;

  @IsOptional()
  @IsString()
  thumbnail: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  category: string;

  @ValidateNested()
  @Type(() => AssetMetric)
  metrics: AssetMetric;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Parameter)
  parameters: Parameter[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Action)
  actions: Action[];

  @Type(() => String)
  contents: Map<string, string>;
}

export class Parameter {
  @IsString()
  id: string;

  @IsEnum(ParameterType)
  type: ParameterType;

  @IsString()
  label: string;

  @IsBoolean()
  default?: boolean;

  @IsArray()
  @ValidateNested()
  @Type(() => Option)
  options?: Option[];
}

export class Option {
  @IsString()
  label: string;
  @IsString()
  value: string;
}

export class Action {
  @IsString()
  id: string;
  @IsString()
  label: string;

  @IsArray()
  @ValidateNested()
  @Type(() => Parameter)
  parameters: Parameter[];
}
