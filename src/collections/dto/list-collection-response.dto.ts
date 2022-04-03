import { Collection } from '../entities/collection.entity';

export class ListCollectionResponseDto {
  rows: Collection[];
  count: number;
}
