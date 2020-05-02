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
const error_1 = require("../../../configuration/error");
const error_handler_1 = require("../error-handler");
const pristine_ready_state_emitter_1 = require("./pristine-ready-state-emitter");
class ErrorHandlerStateEmitter extends pristine_ready_state_emitter_1.PristineReadyStateEmitter {
    constructor() {
        super(...arguments);
        this.targetedNumberOfHandlers = 0;
        this.initializedHandler = 0;
    }
    getSelfAndSetToReadyIfPristineAfterInit() {
        appplication_context_1.applicationContext.whenLoaded(() => {
            if (this.isPristine()) {
                this.changeStateToReady();
            }
        });
        return this;
    }
    initializeErrorHandler(target, methodName) {
        this.changeToStale();
        ++this.targetedNumberOfHandlers;
        appplication_context_1.applicationContext.whenLoaded(() => __awaiter(this, void 0, void 0, function* () {
            this.incrementInitialized();
            const handlerComponent = yield appplication_context_1.applicationContext.loadDependency(target.constructor);
            const method = handlerComponent[methodName];
            if (!decorators_1.decoratedItemIsMethod(method)) {
                throw new error_1.InvalidDecoratedItemError(error_handler_1.ErrorHandler, ['METHOD']);
            }
            const handler = (error) => method.apply(handlerComponent, [error]);
            decorators_1.copyMetadata(method, handler);
            error_handler_1.errorHandlerRegistry.addHandler(handler);
        }));
    }
    incrementInitialized() {
        ++this.initializedHandler;
        if (this.targetedNumberOfHandlers === this.initializedHandler) {
            this.changeStateToReady();
        }
    }
}
exports.ErrorHandlerStateEmitter = ErrorHandlerStateEmitter;
exports.errorHandlerReadyState = new ErrorHandlerStateEmitter();
//# sourceMappingURL=error-handler-state-emitter.js.map