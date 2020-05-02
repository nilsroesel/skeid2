"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("../state");
function RestMapping(decoratorFunction, route, httpMethod) {
    return (target, methodName) => {
        state_1.routesReadyState.incrementTargetNumberOfRoutes();
        state_1.routesReadyState.initializeRoute(decoratorFunction, httpMethod, route, target, methodName);
    };
}
exports.RestMapping = RestMapping;
//# sourceMappingURL=rest-mapping.js.map