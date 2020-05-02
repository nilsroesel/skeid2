"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
function copyMetadata(from, to) {
    Reflect.getOwnMetadataKeys(from).forEach(metadataKey => {
        const metadata = Reflect.getOwnMetadata(metadataKey, from);
        Reflect.defineMetadata(metadataKey, metadata, to);
    });
}
exports.copyMetadata = copyMetadata;
//# sourceMappingURL=copy-metadata.js.map