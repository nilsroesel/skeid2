import 'reflect-metadata';

import { Qualifier } from '../../../global-types';

export const requestBodyMetadata = Symbol('requestBody');
export function RequestBody( target: any, propertyKey: Qualifier, parameterIndex: number ) {
    Reflect.defineMetadata(requestBodyMetadata, parameterIndex, target[propertyKey])
}

export function getRequestParameterIndex( from: Function ): number | undefined {
    return Reflect.getMetadata(requestBodyMetadata, from);
}
