import { useReducer, Reducer, useState, useCallback, useEffect } from 'react';

import JSONAPISource from '@orbit/jsonapi';

import { IQueryTermMap, IQueryOptions, IState, IProvidedProps } from './types';
import { useOrbit } from '../cache';
import { buildQueryTermMap } from './utils';
import { reducer, START, FINISH, ERROR, initialState } from './reducer';

/**
 * import { useQuery } from 'react-orbitjs';
 *
 * function() {
 *   const {
 *     isLoading, error, refetch,
 *     result: { projects, users }
 *   } = useQuery<TReturn>({
 *     projects: q => q.findRecords('projects),
 *     users: q => q.findRecords('users'),
 *   });
 *
 *   console.log(projects, users);
 * }
 *
 * @param mapRecordsToProps
 * @param options
 */
export function useQuery<TResults extends object, THocProps = any>(
  queryBuilderMap: IQueryTermMap,
  options: IQueryOptions<THocProps> = {}
): IProvidedProps<TResults> {
  const { /* useRemoteDirectly, */ mapResultsFn, hocProps } = options;

  const {
    dataStore,
    dataStore: { queryBuilder },
    sources: { remote },
  } = useOrbit();

  const queryTermMap = buildQueryTermMap(queryBuilderMap, queryBuilder);
  const queryKeys = Object.keys(queryTermMap);
  const hasQueries = queryKeys.length > 0;

  const [{ result, error, isLoading }, dispatch] = useReducer<Reducer<IState<TResults>, any>>(
    reducer,
    initialState
  );

  const hasResults = Object.keys(result).length > 0;
  const [needsFetch, setNeedsFetch] = useState(!hasResults);

  // TODO: there may be a bug with dataStore.query in some situations
  //       where the promise never resolves?
  const querier = remote; //useRemoteDirectly ? remote : dataStore;

  const refetch = useCallback(() => {
    setNeedsFetch(true);
  }, []);

  const tryFetch = useCallback(() => {
    if (isLoading) return;
    if (!hasQueries) return;
    if (hasResults && !needsFetch) return;

    const responses = {};

    dispatch({ type: START });

    const requestPromises = queryKeys.map(async (key: string) => {
      const query = queryTermMap[key];

      try {
        const queryResult = await (querier as JSONAPISource).query(...query);
        responses[key] = queryResult;

        return queryResult;
      } catch (e) {
        if (querier === remote) {
          querier.requestQueue.skip();
        }

        throw e;
      }
    });

    Promise.all(requestPromises)
      .then(async () => {
        let mapped = mapResultsFn
          ? await mapResultsFn(dataStore, responses, hocProps || {})
          : responses;

        dispatch({ type: FINISH, result: mapped });

        setNeedsFetch(false);
      })
      .catch(error => {
        dispatch({ type: ERROR, error });
      });
  }, [queryTermMap, needsFetch, hasResults]);

  useEffect(() => {
    if (needsFetch) {
      tryFetch();
    }
  }, [needsFetch]);

  useEffect(() => {
    setNeedsFetch(true);
  }, [JSON.stringify(queryTermMap)]);

  return { error, isLoading, refetch, result };
}
