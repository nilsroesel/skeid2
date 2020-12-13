import { Maybe, Qualifier } from '../../../global-types';

export const endpointMethodIndexMetadata = Symbol('endpointMethod');
export function EndpointMethod( target: any, propertyKey: Qualifier, parameterIndex: number ) {
    Reflect.defineMetadata(endpointMethodIndexMetadata, parameterIndex, target[propertyKey]);
}

export function getEndpointMethodParameterIndexFromMethodMetaData( from: Function ): Maybe<number> {
    return Reflect.getMetadata(endpointMethodIndexMetadata, from);
}
