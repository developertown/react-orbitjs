import { QueryExpression } from '@orbit/data';

export interface IQueryOptions<THocProps = any> {
  passthroughError?: boolean;
  useRemoteDirectly?: boolean;
  noTimeout?: boolean;
  timeout?: number;
  mapResultsFn?: <TMapResult>(
    props: any,
    result: any,
    hocProps: THocProps | object
  ) => Promise<TMapResult>;
  hocProps?: THocProps;
}

export type IProvidedProps<TResult extends object> = IState<TResult> & { refetch: () => void };

export interface IState<TResults extends object> {
  result: TResults | object;
  error: Error | string | undefined;
  isLoading: boolean;
}

export interface IQueryTermMap {
  [key: string]: [QueryExpression];
}
