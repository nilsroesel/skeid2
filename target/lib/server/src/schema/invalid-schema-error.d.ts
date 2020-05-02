import { SchemaDefinition } from './rest-schema';
export declare class InvalidSchemaError extends Error {
    constructor(givenObject: Object, schema: SchemaDefinition<unknown>);
}
