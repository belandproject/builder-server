import { IsNotEmpty } from 'class-validator';

export class CreateAssetPackDto {
  @IsNotEmpty()
  name: string;
  thumbnail: string;
}
