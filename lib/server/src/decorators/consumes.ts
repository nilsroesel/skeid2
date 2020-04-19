import 'reflect-metadata';

import { Maybe, Qualifier } from '../../../global-types';
import { decoratedItemIsMethod } from './utils';
import { InvalidDecoratedItemError } from '../../../configuration/error';

const consumingMimeTypeMetadata = Symbol('consumes:mime-type');
export const MIME_WILDCARD: string = '*/*';

export function Consumes( mimeType: string ) {
    return ( component: any, methodName: Qualifier ) => {
        const probablyMethod: unknown = component[methodName];
        if ( !decoratedItemIsMethod(probablyMethod) ) {
            throw new InvalidDecoratedItemError(Consumes, ['METHOD']);
        }
        Reflect.defineMetadata(consumingMimeTypeMetadata, mimeType, probablyMethod);
    };
}

export function getConsumingMimeType( from: Function ): Maybe<string> {
    return Reflect.getMetadata(consumingMimeTypeMetadata, from);
}
