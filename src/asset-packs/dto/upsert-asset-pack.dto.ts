import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpsertAssetPackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  thumbnail: string;
}
