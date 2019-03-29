import { IQueryTermMap } from './types';
import { QueryBuilder } from '@orbit/data';

export function buildQueryTermMap(queryBuilderMap: any, queryBuilder: QueryBuilder) {
  const queryTermMap: IQueryTermMap = {};

  const queryBuilderKeys = Object.keys(queryBuilderMap).filter(k => k !== 'cacheKey');

  queryBuilderKeys.forEach(key => {
    const query = queryBuilderMap[key];
    const args = typeof query === 'function' ? [query] : query;

    args[0] = args[0](queryBuilder);

    queryTermMap[key] = args;
  });

  return queryTermMap;
}
