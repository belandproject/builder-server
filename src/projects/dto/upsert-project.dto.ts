import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
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
  @Type(() => SceneEntityAttributes)
  entities: Map<string, SceneEntityAttributes>;

  @ValidateNested()
  @Type(() => SceneComponentAttribute)
  components: Map<string, SceneComponentAttribute>;
}

@Exclude()
export class UpsertProjectDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  description: string;

  @Expose()
  @IsNumber()
  cols: number;

  @Expose()
  @IsNumber()
  rows: number;

  @Expose()
  @IsBoolean()
  is_public: boolean;

  @Expose()
  @Type(() => Scene)
  @ValidateNested()
  scene: Scene;

  @Expose()
  @IsOptional()
  @IsString()
  creation_coords: string;
}
