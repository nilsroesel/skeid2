"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error");
const error_handler_registry_1 = require("./error-handler-registry");
const decorators_1 = require("../decorators");
class RestErrorHandler {
    constructor(defaultHandlers = []) {
        this.defaultHandlers = defaultHandlers;
    }
    static customOnly() {
        return new RestErrorHandler();
    }
    static useDefaultHandlerFunction(...handlers) {
        return new RestErrorHandler(handlers);
    }
    static findResponseOptionsMetadataByErrorType(error) {
        return decorators_1.getProducingDecoratorMetadata(error.constructor);
    }
    handleError(error) {
        const customHandlerResult = error_handler_registry_1.errorHandlerRegistry.retainAll()
            .map(handler => handler(error)).filter(result => result instanceof error_1.ApiError)[0];
        const mappedByProducesDecorator = this.tryToMapErrorByMetadata(error);
        return customHandlerResult || mappedByProducesDecorator || new error_1.ApiError(500, `${error.name}: ${error.message} \n ${error.stack || ''}`);
    }
    tryToMapErrorByMetadata(error) {
        const producingMetadata = RestErrorHandler.findResponseOptionsMetadataByErrorType(error);
        if (producingMetadata.statusCode !== undefined) {
            return new error_1.ApiError(producingMetadata.statusCode, error.message);
        }
    }
}
exports.RestErrorHandler = RestErrorHandler;
//# sourceMappingURL=rest-error-handler.js.map