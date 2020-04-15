import 'reflect-metadata';

import { Maybe, Qualifier } from '../../../global-types';
import {
    getNameOfParameter,
    handleAsFactory,
    isParameterFactory,
    registerParameterIndexInMetadata,
    SecondArgument
} from './utils';
const namespace: string = 'path:';

export function PathVariable( nameOrSerializer: any, serializerOrName?: SecondArgument, parameterIndex?: Maybe<number> ): any {
    if ( isParameterFactory(nameOrSerializer, serializerOrName, parameterIndex) ) {
        return handleAsFactory(namespace, nameOrSerializer, serializerOrName as Maybe<Function | string>);
    } else if ( typeof parameterIndex === 'number' ) {
        plainDecorator(nameOrSerializer, serializerOrName as Qualifier, parameterIndex);
    }
}

function plainDecorator( target: any, propertyKey: Qualifier, parameterIndex: number  ): void {
    const parameterName = namespace + getNameOfParameter(target[propertyKey], parameterIndex);
    registerParameterIndexInMetadata(target[propertyKey], parameterName, parameterIndex);
}
