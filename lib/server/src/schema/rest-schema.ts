import { Serializer } from './serializer';
import { InvalidSchemaError } from './invalid-schema-error';

export class RestSchema<T> {

    public static any(): RestSchema<any> {
        const schema: RestSchema<any> = new RestSchema<any>({}, false);
        Object.assign(schema, {
            serialize: ( something: { [property: string]: any} ) => something,
            getLoggableSchemaDefinition: () => ({}),
            checkStrictType: () => {}
        });
        return schema;
    }

    constructor( private schemaDefinition: SchemaDefinition<T>, private strictTypeCheck: boolean = true ) {}

    public serialize( something: { [property: string]: any} ): T | never {
        if ( this.strictTypeCheck ) {
            this.checkStrictType(something);
        }
        const serialized: Partial<T> = {};
        const wrongProperties: Array<Error | undefined> = Object
            .entries(this.schemaDefinition).map(entry => {
                const schemaPropertyKey: string = entry[0];
                const schemaProperty: SchemaProperty<any> = entry[1] as SchemaProperty<any>;
                const definitionOptions: SchemaDefinitionOptions<any> = getDefinitionOptionsFrom(schemaProperty);
                const samePropertyFromSomething: unknown | undefined = something[schemaPropertyKey];

                if ( samePropertyFromSomething === undefined && definitionOptions.required ) {
                    return new Error();
                }

                if ( samePropertyFromSomething === undefined && definitionOptions.defaultValue !== undefined ) {
                    Object.assign(serialized, { [schemaPropertyKey]: definitionOptions.defaultValue });
                    return;
                }
                try {
                    let serializedValue: any = undefined;
                    if ( definitionOptions.serializer instanceof RestSchema ) {
                        serializedValue = definitionOptions.serializer.serialize(samePropertyFromSomething as any)
                    } else if ( typeof definitionOptions.serializer === 'function' ) {
                        serializedValue = definitionOptions.serializer(samePropertyFromSomething);
                    }
                    Object.assign(serialized, { [schemaPropertyKey]: serializedValue })
                } catch ( error ) {
                    return error;
                }
            }).filter(error => error !== undefined);

        if ( wrongProperties.length > 0 ) {
            throw new InvalidSchemaError(something, this.getLoggableSchemaDefinition());
        }

        return serialized as T;
    }

    public getLoggableSchemaDefinition() {
        const loggable = {};
        Object.entries(this.schemaDefinition).forEach(entry => {
            const schemaPropertyKey: string = entry[0];
            const definition: any = getDefinitionOptionsFrom(entry[1] as any);

            if ( definition.serializer instanceof RestSchema ) {
                Object.assign(loggable, {[schemaPropertyKey]: definition.serializer.getLoggableSchemaDefinition() });
            } else {
                const serializer = (definition.serializer as Function).name;
                Object.assign(loggable, {[schemaPropertyKey]: { ...definition, serializer } })
            }
        });
        return loggable;
    }

    private checkStrictType( something: { [property: string]: any} ): void | never {
        const hasMorePropertiesThanDefined: boolean = Object.keys(something).filter(key =>
            Object.keys(this.schemaDefinition).find(k => k === key) === undefined
        ).length > 0;

        if ( hasMorePropertiesThanDefined ) {
            throw new InvalidSchemaError(something, this.getLoggableSchemaDefinition());
        }
    }

}

export type SchemaDefinition<T> = Required<{
    [Property in keyof T]: SchemaProperty<T[Property]>;
}>;

export type SchemaProperty<T> = Serializer<T> | SchemaDefinitionOptions<T> | RestSchema<T>;

export type SchemaDefinitionOptions<T> = {
    serializer: Serializer<T> | RestSchema<T>;
    required?: boolean | undefined;
    defaultValue?: T | undefined;
}

function getDefinitionOptionsFrom( schemaProperty: SchemaProperty<unknown> ): SchemaDefinitionOptions<unknown> | never {
    if ( typeof schemaProperty === 'function' || schemaProperty instanceof RestSchema ) {
        return {
            serializer: schemaProperty,
            required: true
        };
    }
    if ( isSchemaDefinitionOptions(schemaProperty) ) {
        return schemaProperty;
    }
    throw new TypeError(`A defined Schema Property is not valid.`);
}


function isSchemaDefinitionOptions( something: unknown | undefined ): something is SchemaDefinitionOptions<unknown> {
    if ( something === undefined ) return false;
    const serializerIsFunction = typeof (something as SchemaDefinitionOptions<unknown>).serializer === 'function';
    const requiredIsBooleanOrUndefined = typeof (something as SchemaDefinitionOptions<unknown>).required === 'boolean'
        || (something as SchemaDefinitionOptions<unknown>).required === undefined;
    return  serializerIsFunction && requiredIsBooleanOrUndefined;
}
