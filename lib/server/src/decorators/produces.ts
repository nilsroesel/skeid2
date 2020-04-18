import 'reflect-metadata';

import { Maybe, Qualifier } from '../../../global-types';
import { decoratedItemIsMethod } from './utils';
import { InvalidDecoratedItemError, UnrecognizedUsageOfDecoratorError } from '../../../configuration/error';

const statusCodeMetadata = Symbol('status-code');
const mimeTypeMetadata = Symbol('mime-type');

export function Produces( statusCode: number, mimeType?: Maybe<string> ) {
    return ( target: any, methodName?: Maybe<Qualifier> ): void => {
        if ( methodName === undefined ) {
            return handleAsClassDecorator(target, statusCode, mimeType);
        }


        const decoratedItem = target[methodName];
        if ( !decoratedItemIsMethod(decoratedItem) ) {
            throw new InvalidDecoratedItemError(Produces, ['CLASS', 'METHOD']);
        }
        Reflect.defineMetadata(statusCodeMetadata, statusCode, decoratedItem);
        Reflect.defineMetadata(mimeTypeMetadata, mimeType, decoratedItem);
    };
}

function handleAsClassDecorator( constructor: Function, statusCode: number, mimeType: string = 'text/plain' ): void {
    if ( (constructor.prototype instanceof Error) || constructor === Error ) {
        Reflect.defineMetadata(statusCodeMetadata, statusCode, constructor);
        Reflect.defineMetadata(mimeTypeMetadata, mimeType, constructor);
        return;
    }
    throw new UnrecognizedUsageOfDecoratorError(Produces,
        ['CLASS', 'METHOD'],
        `${ constructor.name }: Ony classes extending <<Error>> can be decorated`);
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
