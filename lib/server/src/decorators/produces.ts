import 'reflect-metadata';

import { Maybe, Qualifier } from '../../../global-types';
import { assignOnlyDefinedMetadata, decoratedItemIsMethod } from './utils';
import {
    DecoratorType,
    InvalidDecoratedItemError,
    UnrecognizedUsageOfDecoratorError
} from '../../../configuration/error';

const statusCodeMetadata = Symbol('produces:static-status-code');
const mimeTypeMetadata = Symbol('produces:mime-type');

export type StatusCodeGenerator<T> = ( obj: T ) => number;

const ALLOWED_TYPES: Array<DecoratorType> = ['CLASS', 'METHOD'];
export function Produces<T>( statusCode: number | StatusCodeGenerator<T>, mimeType?: Maybe<string> ) {
    return ( target: any, methodName?: Maybe<Qualifier> ): void => {
        if ( methodName === undefined ) {
            return handleAsClassDecorator(target, statusCode, mimeType);
        }
        const decoratedItem = target[methodName];
        if ( !decoratedItemIsMethod(decoratedItem) ) {
            throw new InvalidDecoratedItemError(Produces, ALLOWED_TYPES);
        }
        const status: StatusCodeGenerator<any> = mergeStatusToFunction(statusCode);
        assignOnlyDefinedMetadata(decoratedItem, statusCodeMetadata, status);
        assignOnlyDefinedMetadata(decoratedItem, mimeTypeMetadata, mimeType);
    };
}

function handleAsClassDecorator( constructor: Function,
    statusCode: number | StatusCodeGenerator<any>, mimeType?: Maybe<string> ): void {
        const status: StatusCodeGenerator<any> = mergeStatusToFunction(statusCode);

        if ( (constructor.prototype instanceof Error) || constructor === Error ) {
            assignOnlyDefinedMetadata(constructor, statusCodeMetadata, status);
            assignOnlyDefinedMetadata(constructor, mimeTypeMetadata, mimeType);
            return;
        }
        throw new UnrecognizedUsageOfDecoratorError(Produces,
            ALLOWED_TYPES,
            `${ constructor.name }: Ony classes extending <<Error>> can be decorated`);
}

function mergeStatusToFunction( from: number | StatusCodeGenerator<any> ): StatusCodeGenerator<any> {
    if ( typeof from === 'number' ) return () => from;
    return from;
}


export interface ProducingMetadata {
    statusCode: Maybe<StatusCodeGenerator<any>>;
    mimeType: Maybe<string>;
}

export function getProducingDecoratorMetadata( from: Function ): ProducingMetadata {
    const statusCode: Maybe<StatusCodeGenerator<any>> = Reflect.getMetadata(statusCodeMetadata, from);
    const mimeType: Maybe<string> = Reflect.getMetadata(mimeTypeMetadata, from);

    if ( statusCode !== undefined ) {
        return { statusCode, mimeType }
    }
    return { statusCode, mimeType };
}
