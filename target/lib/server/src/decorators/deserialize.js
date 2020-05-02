"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const utils_1 = require("./utils");
const deserializerMetadata = Symbol('error-deserializer:string');
const deserializerMimeMetadata = Symbol('error-deserializer:mime');
// Default is resolved by content type: if application/json its JSON.stringify, else its Object.toString()
function Deserialize(deserializer, mimeType) {
    return (target) => {
        utils_1.assignOnlyDefinedMetadata(target, deserializerMetadata, deserializer);
        utils_1.assignOnlyDefinedMetadata(target, deserializerMimeMetadata, mimeType);
    };
}
exports.Deserialize = Deserialize;
function getDeserializerMetadata(from) {
    return {
        deserializer: Reflect.getMetadata(deserializerMetadata, from),
        mimeType: Reflect.getMetadata(deserializerMimeMetadata, from)
    };
}
exports.getDeserializerMetadata = getDeserializerMetadata;
//# sourceMappingURL=deserialize.js.map