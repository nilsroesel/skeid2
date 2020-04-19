import { Serializer } from './serializer';
import { InvalidSchemaError } from './invalid-schema-error';
import { Maybe } from '../../../global-types';


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

    public static string(): RestSchema<string> {
        const schema: RestSchema<string> = new RestSchema<string>('', false);
        Object.assign(schema, {
            serialize: ( something: { [property: string]: any} ) => something,
            getLoggableSchemaDefinition: () => ({ body: 'string'}),
            checkStrictType: () => {},
            preProcessor: () => ( something: string ) => something
        });
        return schema;
    }

    private partialTyping: boolean = false;

    constructor( private schemaDefinition: SchemaDefinition<T>, private strictTypeCheck: boolean = true ) {}

    public intersection<T2>( withSchema: RestSchema<T2> ): RestSchema<T & T2> {
        // Even though the compiler complains. From the logical point
        // SchemaDefinition<T & T2> equals SchemaDefinition<T> & SchemaDefinition<T2>
        const newSchemaDefinition: SchemaDefinition<T & T2> = {
            ...this.schemaDefinition,
            ...withSchema.schemaDefinition
        } as SchemaDefinition<T & T2>;
        return new RestSchema<T & T2>(newSchemaDefinition);
    }

    public preProcessor(): Function {
        return JSON.parse;
    }
    
    public serialize( something: { [property: string]: any} ): T | never {
        if ( this.strictTypeCheck ) {
            this.checkStrictType(something);
        }
        const serialized: Partial<T> = {};
        const wrongProperties: Array<Maybe<Error>> = Object
            .entries(this.schemaDefinition).map(entry => {
                const schemaPropertyKey: string = entry[0];
                const schemaProperty: SchemaProperty<any> = entry[1] as SchemaProperty<any>;
                const definitionOptions: SchemaDefinitionOptions<any> = this.getDefinitionOptionsFrom(schemaProperty);
                const samePropertyFromSomething: unknown | undefined = something[schemaPropertyKey];

                if ( samePropertyFromSomething === undefined && definitionOptions.required ) {
                    return new Error();
                }

                if ( samePropertyFromSomething === undefined && definitionOptions.defaultValue !== undefined ) {
                    Object.assign(serialized, { [schemaPropertyKey]: definitionOptions.defaultValue });
                    return;
                }

                if ( samePropertyFromSomething === undefined && !definitionOptions.required ) {
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
            const definition: any = this.getDefinitionOptionsFrom(entry[1] as any);

            if ( definition.serializer instanceof RestSchema ) {
                Object.assign(loggable, {[schemaPropertyKey]: definition.serializer.getLoggableSchemaDefinition() });
            } else {
                const serializer = (definition.serializer as Function).name;
                Object.assign(loggable, {[schemaPropertyKey]: { ...definition, serializer } })
            }
        });
        return loggable;
    }

    asPartialType(): RestSchema<Partial<T>> {
        const newSchema: RestSchema<Partial<T>> = new RestSchema<Partial<T>>(this.schemaDefinition);
        newSchema.partialTyping = true;
        return newSchema;
    }

    private checkStrictType( something: { [property: string]: any} ): void | never {
        const hasMorePropertiesThanDefined: boolean = Object.keys(something).filter(key =>
            Object.keys(this.schemaDefinition).find(k => k === key) === undefined
        ).length > 0;

        if ( hasMorePropertiesThanDefined ) {
            throw new InvalidSchemaError(something, this.getLoggableSchemaDefinition());
        }
    }

    private getDefinitionOptionsFrom( schemaProperty: SchemaProperty<unknown> ): SchemaDefinitionOptions<unknown> | never {
        if ( typeof schemaProperty === 'function' || schemaProperty instanceof RestSchema ) {
            return {
                serializer: schemaProperty,
                required: !this.partialTyping && true
            };
        }
        if ( isSchemaDefinitionOptions(schemaProperty) ) {
            return { ...schemaProperty, required: !this.partialTyping && schemaProperty.required };
        }
        throw new TypeError(`A defined Schema Property is not valid.`);
    }

}

export type SchemaDefinition<T> = Required<{
    [Property in keyof T]: SchemaProperty<T[Property]>;
}>;

export type SchemaProperty<T> = Serializer<T> | SchemaDefinitionOptions<T> | RestSchema<T>;

export type SchemaDefinitionOptions<T> = {
    serializer: Serializer<T> | RestSchema<T>;
    required?: Maybe<boolean>;
    defaultValue?: Maybe<T> ;
}

function isSchemaDefinitionOptions( something: Maybe<unknown> ): something is SchemaDefinitionOptions<unknown> {
    if ( something === undefined ) return false;
    const serializerIsFunction = typeof (something as SchemaDefinitionOptions<unknown>).serializer === 'function';
    const requiredIsBooleanOrUndefined = typeof (something as SchemaDefinitionOptions<unknown>).required === 'boolean'
        || (something as SchemaDefinitionOptions<unknown>).required === undefined;
    return  serializerIsFunction && requiredIsBooleanOrUndefined;
}
