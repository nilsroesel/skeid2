"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const queryParameterMetadata = Symbol('queryParams');
function QueryParameters(parameterSchema) {
    return (target, methodName) => {
        Reflect.defineMetadata(queryParameterMetadata, parameterSchema, target[methodName]);
    };
}
exports.QueryParameters = QueryParameters;
function getQueryParameterSchemaFromMetadata(from) {
    return Reflect.getOwnMetadata(queryParameterMetadata, from);
}
exports.getQueryParameterSchemaFromMetadata = getQueryParameterSchemaFromMetadata;
//# sourceMappingURL=query-parameters.js.map