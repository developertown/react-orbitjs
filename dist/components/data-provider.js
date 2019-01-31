"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const orbit_context_1 = require("./orbit-context");
class DataProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataStore: props.dataStore,
            sources: props.sources,
            // legacy API
            updateStore: (...args) => props.dataStore.update(...args),
            queryStore: (...args) => props.dataStore.query(...args)
        };
    }
    render() {
        return (React.createElement(orbit_context_1.OrbitContext.Provider, { value: this.state }, this.props.children));
    }
}
exports.DataProvider = DataProvider;
exports.default = DataProvider;
exports.OrbitProvider = DataProvider;
