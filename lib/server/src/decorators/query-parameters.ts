import 'reflect-metadata';

import { RestSchema } from '../schema';
import { Maybe } from '../../../global-types';

const queryParameterMetadata = Symbol('queryParams');

export function QueryParameters<T>( parameterSchema: RestSchema<T> ) {
    return ( target: any, methodName: string ) => {
        Reflect.defineMetadata(queryParameterMetadata, parameterSchema, target[methodName]);
    }
}

export function getQueryParameterSchemaFromMetadata( from: Function ): Maybe<RestSchema<any>> {
    return Reflect.getOwnMetadata(queryParameterMetadata, from);
}
