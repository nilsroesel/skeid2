import 'reflect-metadata';

import { Response, ResponseFactory } from '../connectivity';
import { Instantiable, Qualifier } from '../../../global-types';

const responseEntityParameterInjectionMetadata = Symbol('response-entity-injection');

type SelectorFunction<T> = (factory: ResponseFactory) => () => Instantiable<T>

export interface ResponseEntityInjectionMetadata {
    index: number;
    select: SelectorFunction<any>;
}

export function ResponseEntity<T extends Response>( select: SelectorFunction<T> ) {
    return ( target: any, methodName: Qualifier, index: number ) => {
        const responseEntityInjectionMetadata: ResponseEntityInjectionMetadata = { index, select };
        Reflect.defineMetadata(responseEntityParameterInjectionMetadata, responseEntityInjectionMetadata, target[methodName])
    };
}



export function getResponseEntityInjectionMetadata( from: Function ): ResponseEntityInjectionMetadata | undefined {
    return  Reflect.getMetadata(responseEntityParameterInjectionMetadata, from);
}



