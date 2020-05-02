"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidSchemaError extends Error {
    constructor(givenObject, schema) {
        const json = JSON.stringify;
        super(`Given object: ${json(givenObject)} does not fit into the targeted schema ${json(schema)}.`);
    }
}
exports.InvalidSchemaError = InvalidSchemaError;
//# sourceMappingURL=invalid-schema-error.js.map