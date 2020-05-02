"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const utils_1 = require("./utils");
const namespace = 'query:';
function QueryParameter(nameOrSerializer, serializerOrName, parameterIndex) {
    if (utils_1.isParameterFactory(nameOrSerializer, serializerOrName, parameterIndex)) {
        return utils_1.handleAsFactory(namespace, nameOrSerializer, serializerOrName);
    }
    else if (typeof parameterIndex === 'number') {
        plainDecorator(nameOrSerializer, serializerOrName, parameterIndex);
    }
}
exports.QueryParameter = QueryParameter;
function plainDecorator(target, propertyKey, parameterIndex) {
    const parameterName = namespace + utils_1.getNameOfParameter(target[propertyKey], parameterIndex);
    utils_1.registerParameterIndexInMetadata(target[propertyKey], parameterName, parameterIndex);
}
//# sourceMappingURL=query-parameter.js.map