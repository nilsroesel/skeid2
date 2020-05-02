import { Serializer } from './serializer';
import { Maybe } from '../../../global-types';
export declare class RestSchema<T> {
    private schemaDefinition;
    private strictTypeCheck;
    static any(): RestSchema<any>;
    static string(): RestSchema<string>;
    private partialTyping;
    constructor(schemaDefinition: SchemaDefinition<T>, strictTypeCheck?: boolean);
    intersection<T2>(withSchema: RestSchema<T2>): RestSchema<T & T2>;
    preProcessor(): Function;
    serialize(something: {
        [property: string]: any;
    }): T | never;
    getLoggableSchemaDefinition(): {};
    asPartialType(): RestSchema<Partial<T>>;
    private checkStrictType;
    private getDefinitionOptionsFrom;
}
export declare type SchemaDefinition<T> = Required<{
    [Property in keyof T]: SchemaProperty<T[Property]>;
}>;
export declare type SchemaProperty<T> = Serializer<T> | SchemaDefinitionOptions<T> | RestSchema<T>;
export declare type SchemaDefinitionOptions<T> = {
    serializer: Serializer<T> | RestSchema<T>;
    required?: Maybe<boolean>;
    defaultValue?: Maybe<T>;
};
