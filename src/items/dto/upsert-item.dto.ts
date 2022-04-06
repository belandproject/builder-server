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
  @Type(() => String)
  contents: string[];

  @IsOptional()
  @IsEnum(WearableCategory, { each: true })
  overrideReplaces: WearableCategory[];

  @IsOptional()
  @IsEnum(WearableCategory, { each: true })
  overrideHides: WearableCategory[];
}

export class Data {
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsEnum(ItemType)
  @IsString()
  __type: ItemType;
}

export class WearableData extends Data {
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
  @Type(() => String)
  @ValidateNested({ each: true })
  contents: string[];
}

export class EmoteData extends Data {
  @IsEnum(EmoteCategory)
  category: EmoteCategory;

  @IsEnum(EmoteRepresentation)
  representations: EmoteRepresentation[];
}

export class UpsertItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsUUID(4)
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

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Data, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: '__type',
      subTypes: [
        { value: WearableData, name: ItemType.WEARABLE },
        { value: EmoteData, name: ItemType.EMOTE },
      ],
    },
  })
  data: WearableData | EmoteData;

  @ValidateNested()
  @Type(() => AssetMetric)
  metrics: AssetMetric;

  @Type(() => String)
  contents: Map<string, string>;
}