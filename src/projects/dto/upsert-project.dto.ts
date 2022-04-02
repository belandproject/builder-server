import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum ComponentType {
  GLTFShape = 'GLTFShape',
  Transform = 'Transform',
  NFTShape = 'NFTShape',
  Script = 'Script',
}

export class SceneEntityAttributes {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  components: string[];
}

export class SceneComponentAttribute {
  @IsString()
  id: string;

  @IsEnum(ComponentType)
  type: ComponentType;

  data: any;
}

export class Scene {
  @ValidateNested()
  entities: Map<string, SceneEntityAttributes>;
  @ValidateNested()
  components: Map<string, SceneComponentAttribute>;
}

export class UpsertProjectDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  thumbnail: string;

  @IsNumber()
  cols: number;

  @IsNumber()
  rows: number;

  @Type(() => Scene)
  @ValidateNested()
  scene: Scene;

  @IsOptional()
  @IsString()
  creation_coords: string;
}
