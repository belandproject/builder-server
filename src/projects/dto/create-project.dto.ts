import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';

export enum ComponentType {
  GLTFShape = 'GLTFShape',
  Transform = 'Transform',
  NFTShape = 'NFTShape',
  Script = 'Script',
}

export class SceneEntityAttributes {
  id: string;
  name: string;
  components: string[];
}

export class SceneComponentAttribute {
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

export class CreateProjectDto {
  @IsNotEmpty()
  name: string;
  description: string;
  thumbnail: string;
  cols: number;
  rows: number;
  @ValidateNested()
  scene: Scene;
  creation_coords: string;
}
