import 'reflect-metadata';

import { isQualifier, Maybe, Qualifier } from '../../../global-types';
import { RestSchema } from '../schema';

export const requestBodyMetadata = Symbol('requestBody');
export const requestBodyJsonSchema = Symbol('body:schema:json');
export function RequestBody<T>( schema: any | RestSchema<T>,
    propertyKey?: Maybe<Qualifier>, parameterIndex?: Maybe<number> ): any {
        if ( typeof parameterIndex === 'number' && isQualifier(propertyKey) ) {
            handlePlainDecorator(schema, propertyKey, parameterIndex);
        } else if ( schema instanceof RestSchema ) {
            return handleAsFactory<any>(schema);
        }
}

function handlePlainDecorator( target: any, propertyKey: Qualifier, parameterIndex: number ) {
    Reflect.defineMetadata(requestBodyMetadata, parameterIndex, target[propertyKey]);
    Reflect.defineMetadata(requestBodyJsonSchema, RestSchema.any(), target[propertyKey]);
}

function handleAsFactory<T>( schema: RestSchema<T> ) {
    return ( target: any, propertyKey: Qualifier, parameterIndex: number ) => {
        Reflect.defineMetadata(requestBodyMetadata, parameterIndex, target[propertyKey]);
        Reflect.defineMetadata(requestBodyJsonSchema, schema, target[propertyKey]);
    }
}

export function getRequestParameterIndexFromMethodMetaData( from: Function ): Maybe<number> {
    return Reflect.getMetadata(requestBodyMetadata, from);
}

export function getBodySchemaFromMethodMetadata( from: Function ): Maybe<RestSchema<unknown>> {
    return Reflect.getMetadata(requestBodyJsonSchema, from);
}
