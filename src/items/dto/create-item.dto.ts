import { WearableCategory } from '@dcl/schemas';
import {
  ArrayUnique,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { AssetMetric } from 'src/assets/dto/create-asset.dto';
import { ItemRarity, ItemType } from '../entities/item.entity';

export class CreateItemDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  collection_id: string;
  thumbnail: string;
  content_hash: string;
  price: string;
  beneficiary: string;
  @IsEnum(ItemRarity)
  rarity: ItemRarity;
  @IsEnum(ItemType)
  type: ItemType;
  @ValidateNested()
  wearable: WearableData;
  @ValidateNested()
  emote: EmoteData;
  @ValidateNested()
  metrics: AssetMetric;
  contents: Map<string, string>;
}

export enum WearableBodyShape {
  MALE = 'urn:beland:off-chain:base-avatars:BaseMale',
  FEMALE = 'urn:beland:off-chain:base-avatars:BaseFemale',
}

export class WearableData {
  @IsEnum(WearableBodyShape, { each: true })
  bodyShapes: WearableBodyShape[];
  mainFile: string;
  @ArrayUnique()
  contents: string[];
  @IsEnum(WearableCategory, { each: true })
  overrideReplaces: WearableCategory[];
  @IsEnum(WearableCategory, { each: true })
  hides: WearableCategory[];
  @ArrayUnique()
  tags: string[];
}

export enum EmoteCategory {
  SIMPLE = 'simple',
  LOOP = 'loop',
}

export class EmoteRepresentation {
  @IsNotEmpty()
  @IsEnum(WearableBodyShape, { each: true })
  bodyShapes: WearableBodyShape[];
  @IsNotEmpty()
  mainFile: string;
  @IsNotEmpty()
  contents: string[];
}

export class EmoteData {
  @IsEnum(EmoteCategory, { each: true })
  category: EmoteCategory;
  @IsNotEmpty()
  @IsEnum(EmoteRepresentation, { each: true })
  representations: EmoteRepresentation[];
  @IsNotEmpty()
  tags: string[];
}
