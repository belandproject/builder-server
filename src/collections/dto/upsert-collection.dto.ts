import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class UpsertCollectionDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  urn: string;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  minters: string[];
}
