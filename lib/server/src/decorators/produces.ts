import 'reflect-metadata';

import { Maybe, Qualifier } from '../../../global-types';
import { decoratedItemIsMethod } from './utils';
import { InvalidDecoratedItemError } from '../../../configuration/error';

const statusCodeMetadata = Symbol('status-code');
const mimeTypeMetadata = Symbol('mime-type');

export function Produces( statusCode: number, mimeType?: string ) {
    return ( target: any, methodName: Qualifier ): void => {
        const decoratedItem = target[methodName];
        if ( !decoratedItemIsMethod(decoratedItem) ) {
            throw new InvalidDecoratedItemError(Produces, ['METHOD']);
        }
        Reflect.defineMetadata(statusCodeMetadata, statusCode, decoratedItem);
        Reflect.defineMetadata(mimeTypeMetadata, mimeType, decoratedItem);
    };
}

export interface ProducingMetadata {
    statusCode: Maybe<number>;
    mimeType: Maybe<string>;
}

export function getProducingDecoratorMetadata( from: Function ): ProducingMetadata {
    const statusCode: Maybe<number> = Reflect.getMetadata(statusCodeMetadata, from);
    const mimeType: Maybe<string> = Reflect.getMetadata(mimeTypeMetadata, from);
    return { statusCode, mimeType };
}
