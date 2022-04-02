import { WearableCategory } from '@dcl/schemas';
import { Type } from 'class-transformer';

import {
  IsArray,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { AssetMetric } from 'src/assets/dto/upsert-asset.dto';
import { ItemRarity, ItemType } from '../entities/item.entity';

export enum WearableBodyShape {
  MALE = 'urn:beland:off-chain:base-avatars:BaseMale',
  FEMALE = 'urn:beland:off-chain:base-avatars:BaseFemale',
}

export class WearableRepresentation {
  @IsEnum(WearableBodyShape, { each: true })
  bodyShapes: WearableBodyShape[];

  @IsNotEmpty()
  @IsString()
  mainFile: string;

  @IsArray()
  @Type(() => Content)
  @ValidateNested({ each: true })
  contents: Content[];

  @IsOptional()
  @IsEnum(WearableCategory, { each: true })
  overrideReplaces: WearableCategory[];

  @IsOptional()
  @IsEnum(WearableCategory, { each: true })
  overrideHides: WearableCategory[];
}

export class WearableData {
  @IsEnum(WearableCategory)
  category?: WearableCategory;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WearableRepresentation)
  representations: WearableRepresentation[];

  @IsOptional()
  @IsEnum(WearableCategory, { each: true })
  replaces: WearableCategory[];

  @IsOptional()
  @IsEnum(WearableCategory, { each: true })
  hides: WearableCategory[];

  @IsArray()
  @IsString({ each: true })
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

  @IsString()
  @IsNotEmpty()
  mainFile: string;

  @IsArray()
  @Type(() => Content)
  @ValidateNested({ each: true })
  contents: Content[];
}

export class EmoteData {
  @IsEnum(EmoteCategory)
  category: EmoteCategory;

  @IsEnum(EmoteRepresentation)
  representations: EmoteRepresentation[];

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

export class UpsertItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID(4)
  @IsNotEmpty()
  collection_id: string;

  @IsOptional()
  @IsString()
  thumbnail: string;

  @IsOptional()
  @IsString()
  content_hash: string;

  @IsOptional()
  @IsString()
  price: string;

  @IsOptional()
  @IsEthereumAddress()
  beneficiary: string;

  @IsEnum(ItemRarity)
  rarity: ItemRarity;

  @IsEnum(ItemType)
  type: ItemType;

  @ValidateIf((o) => o.type === ItemType.EMOTE)
  @IsNotEmpty()
  @ValidateNested()
  emote: EmoteData;

  @ValidateIf((o) => o.type === ItemType.WEARABLE)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WearableData)
  wearable: WearableData;

  @ValidateNested()
  @Type(() => AssetMetric)
  metrics: AssetMetric;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Content)
  contents: Content[];
}

export class Content {
  @IsString()
  path: string;

  @IsString()
  hash: string;
}
