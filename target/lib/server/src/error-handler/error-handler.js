"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../decorators");
const error_1 = require("../../../configuration/error");
const state_1 = require("../state");
function ErrorHandler(target, methodName) {
    if (!decorators_1.decoratedItemIsMethod(target[methodName])) {
        throw new error_1.InvalidDecoratedItemError(ErrorHandler, ['METHOD']);
    }
    state_1.errorHandlerReadyState.initializeErrorHandler(target, methodName);
}
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=error-handler.js.map