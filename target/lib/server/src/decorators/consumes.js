"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const utils_1 = require("./utils");
const error_1 = require("../../../configuration/error");
const consumingMimeTypeMetadata = Symbol('consumes:mime-type');
exports.MIME_WILDCARD = '*/*';
function Consumes(mimeType) {
    return (component, methodName) => {
        const probablyMethod = component[methodName];
        if (!utils_1.decoratedItemIsMethod(probablyMethod)) {
            throw new error_1.InvalidDecoratedItemError(Consumes, ['METHOD']);
        }
        Reflect.defineMetadata(consumingMimeTypeMetadata, mimeType, probablyMethod);
    };
}
exports.Consumes = Consumes;
function getConsumingMimeType(from) {
    return Reflect.getMetadata(consumingMimeTypeMetadata, from);
}
exports.getConsumingMimeType = getConsumingMimeType;
//# sourceMappingURL=consumes.js.map