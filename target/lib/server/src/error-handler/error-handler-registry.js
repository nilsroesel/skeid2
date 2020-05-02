"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHandlerRegistry {
    constructor() {
        this.handlers = [];
    }
    addHandler(handler) {
        this.handlers.push(handler);
    }
    retainAll() {
        return this.handlers;
    }
}
exports.ErrorHandlerRegistry = ErrorHandlerRegistry;
exports.errorHandlerRegistry = new ErrorHandlerRegistry();
//# sourceMappingURL=error-handler-registry.js.map