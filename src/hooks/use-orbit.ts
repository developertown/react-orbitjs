import {
  useContext,
  useEffect,
  Dispatch,
  useMemo,
  useCallback,
  useState,
  SetStateAction,
} from 'react';
import { OrbitContext } from '../components/orbit-context';
import { IProps as IOrbitProviderProps } from '../components/data-provider';
import { RecordsToProps } from '../components/shared';
import Store from '@orbit/store';
import { getDataFromCache } from '~/utils/store-helpers';
import { Transform } from '@orbit/data';
import { doesTransformCauseUpdate } from '../components/with-data/subscriber/does-transform-cause-update';

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
  const subscriptionKeys = Object.keys(subscribeToQueries || {});

  const initialData = useMemo<TResult>(
    () => getDataFromCache(dataStore, subscribeToQueries || {}),
    subscriptionKeys
  );
  const [state, setState] = useState<TResult>(initialData);
  const handleTransform = useCallback(
    () => subscribeTo(dataStore, setState, state, subscribeToQueries),
    subscriptionKeys
  );

  useEffect(() => {
    if (subscribeToQueries) {
      dataStore.on('transform', handleTransform);
    }

    return () => {
      dataStore.off('transform', handleTransform);
    };
  }, subscriptionKeys);

  return state;
}

function subscribeTo<TSubscriptions>(
  store: Store,
  setState: Dispatch<SetStateAction<TSubscriptions>>,
  state: TSubscriptions,
  subscribeToQueries: RecordsToProps
) {
  const hasSubscriptions = Object.keys(subscribeToQueries).length > 0;

  return function(transform: Transform) {
    if (!hasSubscriptions) {
      return;
    }

    const shouldUpdate = doesTransformCauseUpdate(
      store,
      transform,
      subscribeToQueries as any,
      state
    );

    if (shouldUpdate) {
      const results = getDataFromCache(store, subscribeToQueries) as TSubscriptions;

      setState({ ...results });
    }
  };
}
