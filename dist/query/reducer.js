"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.START = 'start';
exports.FINISH = 'finish';
exports.ERROR = 'error';
exports.initialState = {
    result: {},
    error: undefined,
    isLoading: false,
};
const actions = {
    [exports.START](state) {
        return Object.assign({}, state, { isLoading: true, error: undefined });
    },
    [exports.FINISH](state, { result }) {
        return Object.assign({}, state, { result, isLoading: false, error: undefined });
    },
    [exports.ERROR](state, { error }) {
        return Object.assign({}, state, { error, isLoading: false });
    },
};
function reducer(state, action) {
    return actions[action.type](state, action);
}
exports.reducer = reducer;
