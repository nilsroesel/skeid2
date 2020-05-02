"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const invalid_schema_error_1 = require("./invalid-schema-error");
class RestSchema {
    constructor(schemaDefinition, strictTypeCheck = true) {
        this.schemaDefinition = schemaDefinition;
        this.strictTypeCheck = strictTypeCheck;
        this.partialTyping = false;
    }
    static any() {
        const schema = new RestSchema({}, false);
        Object.assign(schema, {
            serialize: (something) => something,
            getLoggableSchemaDefinition: () => ({}),
            checkStrictType: () => { }
        });
        return schema;
    }
    static string() {
        const schema = new RestSchema('', false);
        Object.assign(schema, {
            serialize: (something) => something,
            getLoggableSchemaDefinition: () => ({ body: 'string' }),
            checkStrictType: () => { },
            preProcessor: () => (something) => something
        });
        return schema;
    }
    intersection(withSchema) {
        // Even though the compiler complains. From the logical point
        // SchemaDefinition<T & T2> equals SchemaDefinition<T> & SchemaDefinition<T2>
        const newSchemaDefinition = Object.assign(Object.assign({}, this.schemaDefinition), withSchema.schemaDefinition);
        return new RestSchema(newSchemaDefinition);
    }
    preProcessor() {
        return JSON.parse;
    }
    serialize(something) {
        if (this.strictTypeCheck) {
            this.checkStrictType(something);
        }
        const serialized = {};
        const wrongProperties = Object
            .entries(this.schemaDefinition).map(entry => {
            const schemaPropertyKey = entry[0];
            const schemaProperty = entry[1];
            const definitionOptions = this.getDefinitionOptionsFrom(schemaProperty);
            const samePropertyFromSomething = something[schemaPropertyKey];
            if (samePropertyFromSomething === undefined && definitionOptions.required) {
                return new Error();
            }
            if (samePropertyFromSomething === undefined && definitionOptions.defaultValue !== undefined) {
                Object.assign(serialized, { [schemaPropertyKey]: definitionOptions.defaultValue });
                return;
            }
            if (samePropertyFromSomething === undefined && !definitionOptions.required) {
                return;
            }
            try {
                let serializedValue = undefined;
                if (definitionOptions.serializer instanceof RestSchema) {
                    serializedValue = definitionOptions.serializer.serialize(samePropertyFromSomething);
                }
                else if (typeof definitionOptions.serializer === 'function') {
                    serializedValue = definitionOptions.serializer(samePropertyFromSomething);
                }
                Object.assign(serialized, { [schemaPropertyKey]: serializedValue });
            }
            catch (error) {
                return error;
            }
        }).filter(error => error !== undefined);
        if (wrongProperties.length > 0) {
            throw new invalid_schema_error_1.InvalidSchemaError(something, this.getLoggableSchemaDefinition());
        }
        return serialized;
    }
    getLoggableSchemaDefinition() {
        const loggable = {};
        Object.entries(this.schemaDefinition).forEach(entry => {
            const schemaPropertyKey = entry[0];
            const definition = this.getDefinitionOptionsFrom(entry[1]);
            if (definition.serializer instanceof RestSchema) {
                Object.assign(loggable, { [schemaPropertyKey]: definition.serializer.getLoggableSchemaDefinition() });
            }
            else {
                const serializer = definition.serializer.name;
                Object.assign(loggable, { [schemaPropertyKey]: Object.assign(Object.assign({}, definition), { serializer }) });
            }
        });
        return loggable;
    }
    asPartialType() {
        const newSchema = new RestSchema(this.schemaDefinition);
        newSchema.partialTyping = true;
        return newSchema;
    }
    checkStrictType(something) {
        const hasMorePropertiesThanDefined = Object.keys(something).filter(key => Object.keys(this.schemaDefinition).find(k => k === key) === undefined).length > 0;
        if (hasMorePropertiesThanDefined) {
            throw new invalid_schema_error_1.InvalidSchemaError(something, this.getLoggableSchemaDefinition());
        }
    }
    getDefinitionOptionsFrom(schemaProperty) {
        if (typeof schemaProperty === 'function' || schemaProperty instanceof RestSchema) {
            return {
                serializer: schemaProperty,
                required: !this.partialTyping && true
            };
        }
        if (isSchemaDefinitionOptions(schemaProperty)) {
            return Object.assign(Object.assign({}, schemaProperty), { required: !this.partialTyping && schemaProperty.required });
        }
        throw new TypeError(`A defined Schema Property is not valid.`);
    }
}
exports.RestSchema = RestSchema;
function isSchemaDefinitionOptions(something) {
    if (something === undefined)
        return false;
    const serializerIsFunction = typeof something.serializer === 'function';
    const requiredIsBooleanOrUndefined = typeof something.required === 'boolean'
        || something.required === undefined;
    return serializerIsFunction && requiredIsBooleanOrUndefined;
}
//# sourceMappingURL=rest-schema.js.map