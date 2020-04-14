import 'reflect-metadata';

import { RestSchema } from '../schema';

const queryParameterMetadata = Symbol('queryParams');

export function QueryParameters<T>( parameterSchema: RestSchema<T> ) {
    return ( target: any, methodName: string ) => {
        Reflect.defineMetadata(queryParameterMetadata, parameterSchema, target[methodName]);
    }
}

export function getQueryParameterSchemaFromMetadata( from: Function ): RestSchema<any> | undefined {
    return Reflect.getOwnMetadata(queryParameterMetadata, from);
}
