import { IsNotEmpty } from 'class-validator';

export class CreateCollectionDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  symbol: string;
}
