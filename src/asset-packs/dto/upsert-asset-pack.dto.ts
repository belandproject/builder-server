import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UpsertAssetDto } from 'src/assets/dto/upsert-asset.dto';

export class UpsertAssetPackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => UpsertAssetDto)
  assets: UpsertAssetDto[]
}
