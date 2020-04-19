import 'reflect-metadata';

import { Maybe, Qualifier } from '../../../global-types';
import { assignOnlyDefinedMetadata, decoratedItemIsMethod } from './utils';
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
        assignOnlyDefinedMetadata(decoratedItem, statusCodeMetadata, statusCode);
        assignOnlyDefinedMetadata(decoratedItem, mimeTypeMetadata, mimeType);
    };
}

function handleAsClassDecorator( constructor: Function, statusCode: number, mimeType?: Maybe<string> ): void {
    if ( (constructor.prototype instanceof Error) || constructor === Error ) {
        assignOnlyDefinedMetadata(constructor, statusCodeMetadata, statusCode);
        assignOnlyDefinedMetadata(constructor, mimeTypeMetadata, mimeType);
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
