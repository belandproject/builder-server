import { IsEnum, IsNotEmpty, MaxLength, ValidateNested } from 'class-validator';

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
  triangles: number;
  materials: number;
  textures: number;
  meshes: number;
  bodies: number;
  entities: number;
}

export class CreateAssetDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  pack_id: string;
  model: string;
  script: string;
  thumbnail: string;
  @MaxLength(10, { each: true })
  tags: string[];
  category: string;
  @ValidateNested()
  metrics: AssetMetric;
  @ValidateNested()
  parameters: Parameter[];
  @ValidateNested()
  actions: Action[];
  @MaxLength(1000, {
    each: true,
  })
  contents: Map<string, string>;
}

export class Parameter {
  id: string;
  @IsEnum(ParameterType)
  type: ParameterType;
  label: string;
  default?: number | string | boolean;
  @ValidateNested()
  options?: Option[];
}

export class Option {
  label: string;
  value: string;
}

export class Action {
  id: string;
  label: string;
  @ValidateNested()
  parameters: Parameter[];
}
