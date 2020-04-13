import 'reflect-metadata';

import { Qualifier } from '../../../global-types';
import {
    getNameOfParameter,
    handleAsFactory,
    isParameterFactory,
    registerParameterIndexInMetadata,
    SecondArgument
} from './utils';
const namespace: string = 'path:';

export function PathParameter( nameOrSerializer: any, serializerOrName?: SecondArgument, parameterIndex?: number | undefined ): any {
    if ( isParameterFactory(nameOrSerializer, serializerOrName, parameterIndex) ) {
        return handleAsFactory(namespace, nameOrSerializer, serializerOrName as Function | string | undefined);
    } else if ( typeof parameterIndex === 'number' ) {
        plainDecorator(nameOrSerializer, serializerOrName as Qualifier, parameterIndex);
    }
}

function plainDecorator( target: any, propertyKey: Qualifier, parameterIndex: number  ): void {
    const parameterName = namespace + getNameOfParameter(target[propertyKey], parameterIndex);
    registerParameterIndexInMetadata(target[propertyKey], parameterName, parameterIndex);
}
