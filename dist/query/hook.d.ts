import { IQueryTermMap, IQueryOptions, IProvidedProps } from './types';
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
export declare function useQuery<TResults extends object, THocProps = any>(queryBuilderMap: IQueryTermMap, options?: IQueryOptions<THocProps>): IProvidedProps<TResults>;
