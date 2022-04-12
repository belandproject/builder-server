import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UpsertAssetDto } from 'src/assets/dto/upsert-asset.dto';

@Exclude()
export class UpsertAssetPackDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => UpsertAssetDto)
  assets: UpsertAssetDto[]
}
