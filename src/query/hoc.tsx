import * as React from 'react';

import { ErrorMessage } from '../components/errors';
import { useQuery } from './hook';
import { IQueryOptions } from './types';

const defaultOptions = {
  passthroughError: false,
  useRemoteDirectly: false,
  mapResultsFn: undefined,
  noTimeout: false,
  timeout: 5000,
};

// Example Usage
//
// import { query } from '@data';
//
// export default compose(
//   query((passedProps) => {
//
//     return {
//       someKey: q => q.findRecord(...),
//       someOtherKey: [q => q.findRecord, { /* source options */ }]
//     }
//   })
// )(SomeComponent);
//
//
// Why does this exist?
// the react-orbitjs addon actually doesn't give is much.
// it has a "lot" of cache-related handling, but no ergonomic
// way to actually make network requests.
//
// TODO: tie in to react-orbitjs' cache handling.
// TODO: what if we just use orbit directly? do we need react-orbitjs?
export function query<TWrappedProps, TResult extends object>(
  mapRecordsToProps: any,
  options?: IQueryOptions<TWrappedProps>
) {
  let map: any;
  const opts: IQueryOptions<TWrappedProps> = {
    ...defaultOptions,
    ...(options || {}),
  };

  const { passthroughError, useRemoteDirectly, mapResultsFn } = opts;

  if (typeof mapRecordsToProps !== 'function') {
    map = (/* props */) => ({
      cacheKey: 'default-cache-key',
      ...mapRecordsToProps,
    });
  } else {
    map = mapRecordsToProps;
  }

  return (InnerComponent: any) => {
    return function DataWrapper(props: TWrappedProps) {
      const queryBuilderMap = map(props);

      const { error, result, isLoading, refetch } = useQuery<TResult, TWrappedProps>(
        queryBuilderMap,
        {
          mapResultsFn,
          useRemoteDirectly,
          hocProps: props,
        }
      );

      if (!passthroughError && error) {
        return <ErrorMessage error={error} />;
      }

      return (
        <InnerComponent
          {...props}
          {...{
            ...result,
            error,
            isLoading,
            refetch,
          }}
        />
      );
    };
  };
}
