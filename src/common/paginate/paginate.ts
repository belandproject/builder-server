import { Op } from 'sequelize';
import { WhereOperators } from 'sequelize';
import { PaginateQuery } from './decorator';
import { Column, RelationColumn, SortBy } from './helper';

export class Paginated<T> {
  rows: T[];
  count: number;
}

export interface PaginateConfig<T> {
  include?: any[];
  sortableColumns: Column<T>[];
  searchableColumns?: Column<T>[];
  maxLimit?: number;
  defaultSortBy?: SortBy<T>;
  defaultLimit?: number;
  where?: any;
  filterableColumns?: { [column: string]: any[] };
  attributes?: string[];
}

function parseFilter<T>(query: PaginateQuery, config: PaginateConfig<T>) {
  const filter: {
    [columnName: string]: WhereOperators | string | number | boolean;
  } = {};
  for (const column of Object.keys(query.filter)) {
    const columnArr = column.split('__');
    if (columnArr.length === 1) {
      if (!(column in config.filterableColumns)) {
        continue;
      }
      if (typeof query.filter[column] === 'string') {
        filter[column] = query.filter[column] as string;
      } else if (Array.isArray(query.filter[column])) {
        filter[column] = {
          [Op.in]: query.filter[column] as any,
        };
      }
    } else if (columnArr.length === 2 && Op[columnArr[1]]) {
      if (!(columnArr[0] in config.filterableColumns)) {
        continue;
      }

      if (!config.filterableColumns[columnArr[0]].includes(Op[columnArr[1]])) {
        continue;
      }

      if (!filter[columnArr[0]]) {
        filter[columnArr[0]] = {};
      }
      switch (Op[columnArr[1]]) {
        case Op.in:
        case Op.notIn:
          if (Array.isArray(query.filter[column])) {
            filter[columnArr[0]][Op[columnArr[1]]] = query.filter[column];
          } else {
            const v = query.filter[column] as string;
            filter[columnArr[0]][Op[columnArr[1]]] = v.split(',');
          }
          break;
        default:
          filter[columnArr[0]][Op[columnArr[1]]] = query.filter[column];
          break;
      }
    }
  }
  return filter;
}

export async function paginate<T>(
  query: PaginateQuery,
  repo: any,
  config: PaginateConfig<T>,
): Promise<Paginated<T>> {
  let where = {};
  if (query.filter) {
    where = parseFilter(query, config);
  }

  const limit = query.limit || config.defaultLimit;

  return repo.findAndCountAll({
    attributes: config.attributes,
    limit: limit > config.maxLimit ? config.maxLimit : limit,
    offset: query.offset,
    where: {
      ...where,
      ...config.where,
    },
    include: config.include,
    order: query.sortBy,
  });
}
