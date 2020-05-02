"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function DateSerializer(dateString) {
    return new Date(dateString);
}
exports.DateSerializer = DateSerializer;
function ArraySerializer(itemSchema) {
    const name = `ArrayOf[${JSON.stringify(itemSchema.getLoggableSchemaDefinition())}]`;
    const serializer = {
        [name]: (fromArray) => {
            if (!Array.isArray(fromArray)) {
                throw new TypeError(`Expected <<${fromArray}>> to be array type`);
            }
            return fromArray.map(item => itemSchema.serialize(item));
        }
    };
    return serializer[name];
}
exports.ArraySerializer = ArraySerializer;
//# sourceMappingURL=serializer.js.map