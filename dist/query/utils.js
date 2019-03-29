"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildQueryTermMap(queryBuilderMap, queryBuilder) {
    const queryTermMap = {};
    const queryBuilderKeys = Object.keys(queryBuilderMap).filter(k => k !== 'cacheKey');
    queryBuilderKeys.forEach(key => {
        const query = queryBuilderMap[key];
        const args = typeof query === 'function' ? [query] : query;
        args[0] = args[0](queryBuilder);
        queryTermMap[key] = args;
    });
    return queryTermMap;
}
exports.buildQueryTermMap = buildQueryTermMap;
