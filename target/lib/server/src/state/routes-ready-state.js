"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appplication_context_1 = require("../../../injection/src/appplication-context");
const utils_1 = require("../decorators/utils");
const error_1 = require("../../../configuration/error");
const router_1 = require("../routing/router");
const ready_state_emitter_1 = require("./ready-state-emitter");
class RoutesReadyState extends ready_state_emitter_1.ReadyStateEmitter {
    constructor() {
        super(...arguments);
        this.targetNumberOfRoutes = 0;
        this.initializedRoutes = 0;
    }
    incrementTargetNumberOfRoutes() {
        ++this.targetNumberOfRoutes;
    }
    incrementInitializedRoutes() {
        ++this.initializedRoutes;
        if (this.initializedRoutes === this.targetNumberOfRoutes) {
            this.setReady();
        }
    }
    initializeRoute(httpMethod, route, target, methodName) {
        // TODO Polish the load time with an good metric (timeout value)
        // This will change effectively the evaluation order of the typescript decorators.
        // To ensure decorators, on which this decorator relies on, are evaluated
        setTimeout(() => {
            appplication_context_1.applicationContext.loadDependency(target.constructor).then((component) => {
                const method = component[methodName];
                if (!utils_1.decoratedItemIsMethod(method)) {
                    throw new error_1.InvalidDecoratedItemError(target, methodName);
                }
                this.incrementInitializedRoutes();
                router_1.router.registerRoute(httpMethod, route, () => method.apply(component));
            });
        }, 100);
    }
}
exports.RoutesReadyState = RoutesReadyState;
exports.routesReadyState = new RoutesReadyState();
//# sourceMappingURL=routes-ready-state.js.map