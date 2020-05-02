"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const responseEntityParameterInjectionMetadata = Symbol('response-entity-injection');
function ResponseEntity(select) {
    return (target, methodName, index) => {
        const responseEntityInjectionMetadata = { index, select };
        Reflect.defineMetadata(responseEntityParameterInjectionMetadata, responseEntityInjectionMetadata, target[methodName]);
    };
}
exports.ResponseEntity = ResponseEntity;
function getResponseEntityInjectionMetadata(from) {
    return Reflect.getMetadata(responseEntityParameterInjectionMetadata, from);
}
exports.getResponseEntityInjectionMetadata = getResponseEntityInjectionMetadata;
//# sourceMappingURL=response-entity.js.map