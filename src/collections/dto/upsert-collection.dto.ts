import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpsertCollectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsArray()
  @IsString({ each: true })
  minters: string[];
}
