"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const orbit_context_1 = require("../components/orbit-context");
const store_helpers_1 = require("../utils/store-helpers");
const does_transform_cause_update_1 = require("../components/with-data/subscriber/does-transform-cause-update");
const determine_subscriptions_1 = require("../components/with-data/subscriber/determine-subscriptions");
function useOrbit(subscribeToQueries) {
    const context = react_1.useContext(orbit_context_1.OrbitContext);
    const subscriptions = useCacheSubscription(subscribeToQueries || {});
    return Object.assign({}, context, { subscriptions });
}
exports.useOrbit = useOrbit;
function useCacheSubscription(subscribeToQueries) {
    const { dataStore } = react_1.useContext(orbit_context_1.OrbitContext);
    const subscriptions = determine_subscriptions_1.determineSubscriptions(dataStore, subscribeToQueries);
    const hasSubscriptions = hasKeys(subscribeToQueries);
    const initialData = react_1.useMemo(() => {
        if (hasSubscriptions) {
            return store_helpers_1.getDataFromCache(dataStore, subscribeToQueries || {});
        }
        return {};
    }, [dataStore, hasSubscriptions, subscribeToQueries]);
    const [state, setState] = react_1.useState(initialData);
    const handleTransform = react_1.useMemo(() => subscribeTo(dataStore, setState, state, subscribeToQueries), [dataStore, state, subscribeToQueries]);
    react_1.useEffect(() => {
        if (hasSubscriptions) {
            dataStore.on('transform', handleTransform);
        }
        return () => {
            dataStore.off('transform', handleTransform);
        };
    }, [dataStore, handleTransform, hasSubscriptions, subscriptions]);
    return state;
}
function subscribeTo(store, setState, state, subscribeToQueries) {
    const subscriptions = determine_subscriptions_1.determineSubscriptions(store, subscribeToQueries);
    const hasSubscriptions = hasKeys(subscribeToQueries);
    return function (transform) {
        if (!hasSubscriptions) {
            return;
        }
        const shouldUpdate = does_transform_cause_update_1.doesTransformCauseUpdate(store, transform, subscriptions, state);
        if (shouldUpdate) {
            const results = store_helpers_1.getDataFromCache(store, subscribeToQueries);
            setState(Object.assign({}, results));
        }
    };
}
function hasKeys(obj) {
    return Object.keys(obj || {}).length > 0;
}
