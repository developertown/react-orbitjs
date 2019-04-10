"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const cache_1 = require("../cache");
const utils_1 = require("./utils");
const reducer_1 = require("./reducer");
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
function useQuery(queryBuilderMap, options = {}) {
    const { /* useRemoteDirectly, */ mapResultsFn, hocProps } = options;
    const { dataStore, dataStore: { queryBuilder }, sources: { remote }, } = cache_1.useOrbit();
    const queryTermMap = utils_1.buildQueryTermMap(queryBuilderMap, queryBuilder);
    const queryKeys = Object.keys(queryTermMap);
    const hasQueries = queryKeys.length > 0;
    const [{ result, error, isLoading }, dispatch] = react_1.useReducer(reducer_1.reducer, reducer_1.initialState);
    const hasResults = Object.keys(result).length > 0;
    const [needsFetch, setNeedsFetch] = react_1.useState(!hasResults);
    // TODO: there may be a bug with dataStore.query in some situations
    //       where the promise never resolves?
    const querier = remote; //useRemoteDirectly ? remote : dataStore;
    const refetch = react_1.useCallback(() => {
        setNeedsFetch(true);
    }, []);
    const tryFetch = react_1.useCallback(() => {
        if (isLoading)
            return;
        if (!hasQueries)
            return;
        if (hasResults && !needsFetch)
            return;
        const responses = {};
        dispatch({ type: reducer_1.START });
        const requestPromises = queryKeys.map((key) => __awaiter(this, void 0, void 0, function* () {
            const query = queryTermMap[key];
            try {
                const queryResult = yield querier.query(...query);
                responses[key] = queryResult;
                return queryResult;
            }
            catch (e) {
                if (querier === remote) {
                    querier.requestQueue.skip();
                }
                throw e;
            }
        }));
        Promise.all(requestPromises)
            .then(() => __awaiter(this, void 0, void 0, function* () {
            let mapped = mapResultsFn
                ? yield mapResultsFn(dataStore, responses, hocProps || {})
                : responses;
            dispatch({ type: reducer_1.FINISH, result: mapped });
            setNeedsFetch(false);
        }))
            .catch(error => {
            dispatch({ type: reducer_1.ERROR, error });
        });
    }, [
        isLoading,
        hasQueries,
        hasResults,
        needsFetch,
        queryKeys,
        queryTermMap,
        querier,
        remote,
        mapResultsFn,
        dataStore,
        hocProps,
    ]);
    react_1.useEffect(() => {
        if (needsFetch) {
            tryFetch();
        }
    }, [needsFetch, tryFetch]);
    react_1.useEffect(() => {
        setNeedsFetch(true);
    }, [JSON.stringify(queryTermMap)]);
    return { error, isLoading, refetch, result };
}
exports.useQuery = useQuery;
