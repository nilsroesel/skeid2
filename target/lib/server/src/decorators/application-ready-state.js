"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const appplication_context_1 = require("../../../injection/src/appplication-context");
const utils_1 = require("./utils");
const error_1 = require("../../../configuration/error");
const router_1 = require("../routing/router");
class ApplicationReadyState {
    constructor() {
        this.isReadyEventEmitter = new events_1.EventEmitter();
        this.isReady = false;
        this.targetNumberOfRoutes = 0;
        this.initializedRoutes = 0;
    }
    incrementTargetNumberOfRoutes() {
        ++this.targetNumberOfRoutes;
    }
    incrementInitializedRoutes() {
        ++this.initializedRoutes;
        if (this.initializedRoutes === this.targetNumberOfRoutes) {
            this.isReadyEventEmitter.emit('ready');
            this.isReadyEventEmitter.removeAllListeners('ready');
        }
    }
    ifReady(callback) {
        if (this.isReady) {
            callback();
        }
        else {
            this.isReadyEventEmitter.addListener('ready', callback);
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
exports.ApplicationReadyState = ApplicationReadyState;
exports.applicationReadyState = new ApplicationReadyState();
//# sourceMappingURL=application-ready-state.js.map