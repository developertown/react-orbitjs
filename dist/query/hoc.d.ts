/// <reference types="react" />
import { IQueryOptions } from './types';
export declare function query<TWrappedProps, TResult extends object>(mapRecordsToProps: any, options?: IQueryOptions<TWrappedProps>): (InnerComponent: any) => (props: TWrappedProps) => JSX.Element;
