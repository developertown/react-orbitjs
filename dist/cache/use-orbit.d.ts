import { IProps as IOrbitProviderProps } from '../components/data-provider';
import { RecordsToProps } from '../components/shared';
interface SubscriptionState<T> {
    subscriptions: T;
}
export declare function useOrbit<TSubscriptions extends object>(subscribeToQueries?: RecordsToProps): IOrbitProviderProps & SubscriptionState<TSubscriptions>;
export {};
