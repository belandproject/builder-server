import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Dictionary, isString } from 'lodash';

export interface PaginateQuery {
  offset?: number;
  limit?: number;
  sortBy?: [string, string][];
  searchBy?: string[];
  search?: string;
  filter?: { [column: string]: string | string[] };
  path: string;
}

export const Paginate = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): PaginateQuery => {
    const request: Request = ctx.switchToHttp().getRequest();
    const { query } = request;

    // Determine if Express or Fastify to rebuild the original url and reduce down to protocol, host and base url
    let originalUrl;
    if (request.originalUrl) {
      originalUrl =
        request.protocol + '://' + request.get('host') + request.originalUrl;
    } else {
      originalUrl = request.protocol + '://' + request.hostname + request.url;
    }
    const urlParts = new URL(originalUrl);
    const path = urlParts.protocol + '//' + urlParts.host + urlParts.pathname;

    const _sortBy: [string, string][] = [];
    const _searchBy: string[] = [];

    const { search, sortBy, searchBy, offset, limit, ...filter } = query;

    if (sortBy) {
      const params = !Array.isArray(sortBy) ? [sortBy] : sortBy;
      for (const param of params) {
        if (isString(param)) {
          const items = param.split(':');
          if (items.length === 2) {
            _sortBy.push(items as [string, string]);
          }
        }
      }
    }

    if (searchBy) {
      const params = !Array.isArray(searchBy) ? [searchBy] : searchBy;
      for (const param of params) {
        if (isString(param)) {
          _searchBy.push(param);
        }
      }
    }
    return {
      offset: offset ? parseInt(offset.toString(), 10) : undefined,
      limit: limit ? parseInt(limit.toString(), 10) : undefined,
      sortBy: _sortBy.length ? _sortBy : undefined,
      search: search ? search.toString() : undefined,
      searchBy: _searchBy.length ? _searchBy : undefined,
      filter: Object.keys(filter).length
        ? (filter as Dictionary<string | string[]>)
        : undefined,
      path,
    };
  },
);
