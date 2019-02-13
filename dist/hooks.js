"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const orbit_context_1 = require("./components/orbit-context");
function useOrbit() {
    return react_1.useContext(orbit_context_1.OrbitContext);
}
exports.useOrbit = useOrbit;
