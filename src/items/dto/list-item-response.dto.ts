import { Item } from '../entities/item.entity';

export class ListItemResponseDto {
  rows: Item[];
  count: number;
}
