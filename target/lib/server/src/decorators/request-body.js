"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const global_types_1 = require("../../../global-types");
const schema_1 = require("../schema");
exports.requestBodyMetadata = Symbol('requestBody');
exports.requestBodyJsonSchema = Symbol('body:schema:json');
function RequestBody(schema, propertyKey, parameterIndex) {
    if (typeof parameterIndex === 'number' && global_types_1.isQualifier(propertyKey)) {
        handlePlainDecorator(schema, propertyKey, parameterIndex);
    }
    else if (schema instanceof schema_1.RestSchema) {
        return handleAsFactory(schema);
    }
}
exports.RequestBody = RequestBody;
function handlePlainDecorator(target, propertyKey, parameterIndex) {
    Reflect.defineMetadata(exports.requestBodyMetadata, parameterIndex, target[propertyKey]);
    Reflect.defineMetadata(exports.requestBodyJsonSchema, schema_1.RestSchema.any(), target[propertyKey]);
}
function handleAsFactory(schema) {
    return (target, propertyKey, parameterIndex) => {
        Reflect.defineMetadata(exports.requestBodyMetadata, parameterIndex, target[propertyKey]);
        Reflect.defineMetadata(exports.requestBodyJsonSchema, schema, target[propertyKey]);
    };
}
function getRequestParameterIndexFromMethodMetaData(from) {
    return Reflect.getMetadata(exports.requestBodyMetadata, from);
}
exports.getRequestParameterIndexFromMethodMetaData = getRequestParameterIndexFromMethodMetaData;
function getBodySchemaFromMethodMetadata(from) {
    return Reflect.getMetadata(exports.requestBodyJsonSchema, from);
}
exports.getBodySchemaFromMethodMetadata = getBodySchemaFromMethodMetadata;
//# sourceMappingURL=request-body.js.map