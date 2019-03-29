"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const errors_1 = require("../components/errors");
const hook_1 = require("./hook");
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
function query(mapRecordsToProps, options) {
    let map;
    const opts = Object.assign({}, defaultOptions, (options || {}));
    const { passthroughError, useRemoteDirectly, mapResultsFn } = opts;
    if (typeof mapRecordsToProps !== 'function') {
        map = ( /* props */) => (Object.assign({ cacheKey: 'default-cache-key' }, mapRecordsToProps));
    }
    else {
        map = mapRecordsToProps;
    }
    return (InnerComponent) => {
        return function DataWrapper(props) {
            const queryBuilderMap = map(props);
            const { error, result, isLoading, refetch } = hook_1.useQuery(queryBuilderMap, {
                mapResultsFn,
                useRemoteDirectly,
                hocProps: props,
            });
            if (!passthroughError && error) {
                return React.createElement(errors_1.ErrorMessage, { error: error });
            }
            return (React.createElement(InnerComponent, Object.assign({}, props, Object.assign({}, result, { error,
                isLoading,
                refetch }))));
        };
    };
}
exports.query = query;
