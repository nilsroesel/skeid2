import { SchemaDefinition } from './rest-schema';

export class InvalidSchemaError extends Error {
    constructor( givenObject: Object, schema: SchemaDefinition<unknown> ) {
        const json = JSON.stringify;
        super(`Given object: ${ json(givenObject) } does not fit into the targeted schema ${ json(schema) }.`);
    }
}
