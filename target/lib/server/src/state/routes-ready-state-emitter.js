"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const appplication_context_1 = require("../../../injection/src/appplication-context");
const decorators_1 = require("../decorators");
const configuration_1 = require("../../../configuration");
const router_1 = require("../routing/router");
const pristine_ready_state_emitter_1 = require("./pristine-ready-state-emitter");
class RoutesReadyStateEmitter extends pristine_ready_state_emitter_1.PristineReadyStateEmitter {
    constructor() {
        super(...arguments);
        this.targetNumberOfRoutes = 0;
        this.initializedRoutes = 0;
    }
    getSelfAndSetToReadyIfPristineAfterInit() {
        appplication_context_1.applicationContext.whenLoaded(() => {
            if (this.isPristine()) {
                this.changeStateToReady();
            }
        });
        return this;
    }
    incrementTargetNumberOfRoutes() {
        this.changeToStale();
        ++this.targetNumberOfRoutes;
    }
    incrementInitializedRoutes() {
        ++this.initializedRoutes;
        if (this.initializedRoutes === this.targetNumberOfRoutes) {
            this.changeStateToReady();
        }
    }
    initializeRoute(decorator, httpMethod, route, target, methodName) {
        // This will change effectively the evaluation order of the typescript decorators.
        // To ensure decorators, on which this decorator relies on, are evaluated
        appplication_context_1.applicationContext.whenLoaded(() => __awaiter(this, void 0, void 0, function* () {
            const component = yield appplication_context_1.applicationContext.loadDependency(target.constructor);
            const method = component[methodName];
            if (!decorators_1.decoratedItemIsMethod(method)) {
                throw new configuration_1.InvalidDecoratedItemError(decorator, ['METHOD']);
            }
            const restMethod = (args) => method.apply(component, args);
            decorators_1.copyMetadata(method, restMethod);
            this.incrementInitializedRoutes();
            router_1.router.registerRoute(httpMethod, route, restMethod);
        }));
    }
}
exports.routesReadyState = new RoutesReadyStateEmitter();
//# sourceMappingURL=routes-ready-state-emitter.js.map