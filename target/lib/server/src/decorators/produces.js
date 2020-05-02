"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const utils_1 = require("./utils");
const error_1 = require("../../../configuration/error");
const statusCodeMetadata = Symbol('produces:static-status-code');
const mimeTypeMetadata = Symbol('produces:mime-type');
const ALLOWED_TYPES = ['CLASS', 'METHOD'];
function Produces(statusCode, mimeType) {
    return (target, methodName) => {
        if (methodName === undefined) {
            return handleAsClassDecorator(target, statusCode, mimeType);
        }
        const decoratedItem = target[methodName];
        if (!utils_1.decoratedItemIsMethod(decoratedItem)) {
            throw new error_1.InvalidDecoratedItemError(Produces, ALLOWED_TYPES);
        }
        const status = mergeStatusToFunction(statusCode);
        utils_1.assignOnlyDefinedMetadata(decoratedItem, statusCodeMetadata, status);
        utils_1.assignOnlyDefinedMetadata(decoratedItem, mimeTypeMetadata, mimeType);
    };
}
exports.Produces = Produces;
function handleAsClassDecorator(constructor, statusCode, mimeType) {
    const status = mergeStatusToFunction(statusCode);
    if ((constructor.prototype instanceof Error) || constructor === Error) {
        utils_1.assignOnlyDefinedMetadata(constructor, statusCodeMetadata, status);
        utils_1.assignOnlyDefinedMetadata(constructor, mimeTypeMetadata, mimeType);
        return;
    }
    throw new error_1.UnrecognizedUsageOfDecoratorError(Produces, ALLOWED_TYPES, `${constructor.name}: Ony classes extending <<Error>> can be decorated`);
}
function mergeStatusToFunction(from) {
    if (typeof from === 'number')
        return () => from;
    return from;
}
function getProducingDecoratorMetadata(from) {
    const statusCode = Reflect.getMetadata(statusCodeMetadata, from);
    const mimeType = Reflect.getMetadata(mimeTypeMetadata, from);
    if (statusCode !== undefined) {
        return { statusCode, mimeType };
    }
    return { statusCode, mimeType };
}
exports.getProducingDecoratorMetadata = getProducingDecoratorMetadata;
//# sourceMappingURL=produces.js.map