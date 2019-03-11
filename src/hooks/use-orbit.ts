import { useContext, useEffect, Dispatch, useMemo, useState, SetStateAction } from 'react';
import { OrbitContext } from '../components/orbit-context';
import { IProps as IOrbitProviderProps } from '../components/data-provider';
import { RecordsToProps } from '../components/shared';
import Store from '@orbit/store';
import { getDataFromCache } from '../utils/store-helpers';
import { Transform } from '@orbit/data';
import { doesTransformCauseUpdate } from '../components/with-data/subscriber/does-transform-cause-update';
import { determineSubscriptions } from '../components/with-data/subscriber/determine-subscriptions';

interface SubscriptionState<T> {
  subscriptions: T;
}

export function useOrbit<TSubscriptions extends object>(
  subscribeToQueries?: RecordsToProps
): IOrbitProviderProps & SubscriptionState<TSubscriptions> {
  const context = useContext<IOrbitProviderProps>(OrbitContext);
  const subscriptions = useCacheSubscription<TSubscriptions>(subscribeToQueries || {});

  return { ...context, subscriptions };
}

function useCacheSubscription<TResult>(subscribeToQueries: RecordsToProps): TResult {
  const { dataStore } = useContext<IOrbitProviderProps>(OrbitContext);
  const subscriptions = determineSubscriptions(dataStore, subscribeToQueries);
  const hasSubscriptions = hasKeys(subscribeToQueries);

  const initialData = useMemo<TResult>(() => {
    if (hasSubscriptions) {
      return getDataFromCache(dataStore, subscribeToQueries || {});
    }

    return {} as any;
  }, [dataStore, hasSubscriptions, subscribeToQueries]);
  const [state, setState] = useState<TResult>(initialData);
  const handleTransform = useMemo(
    () => subscribeTo(dataStore, setState, state, subscribeToQueries),
    [dataStore, state, subscribeToQueries]
  );

  useEffect(() => {
    if (hasSubscriptions) {
      dataStore.on('transform', handleTransform);
    }

    return () => {
      dataStore.off('transform', handleTransform);
    };
  }, [dataStore, handleTransform, hasSubscriptions, subscriptions]);

  return state;
}

function subscribeTo<TSubscriptions>(
  store: Store,
  setState: Dispatch<SetStateAction<TSubscriptions>>,
  state: TSubscriptions,
  subscribeToQueries: RecordsToProps
) {
  const subscriptions = determineSubscriptions(store, subscribeToQueries);
  const hasSubscriptions = hasKeys(subscribeToQueries);

  return function(transform: Transform) {
    if (!hasSubscriptions) {
      return;
    }

    const shouldUpdate = doesTransformCauseUpdate(store, transform, subscriptions, state);

    if (shouldUpdate) {
      const results = getDataFromCache(store, subscribeToQueries) as TSubscriptions;

      setState({ ...results });
    }
  };
}

function hasKeys(obj: any) {
  return Object.keys(obj || {}).length > 0;
}
