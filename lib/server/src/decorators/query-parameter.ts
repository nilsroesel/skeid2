import 'reflect-metadata';

import { Qualifier } from '../../../global-types';
import { getNameOfParameter, registerParameterIndexInMetadata } from './utils';

const namespace = 'query:';
export function QueryParameter( parameterName: any, propertyKey?: Qualifier, parameterIndex?: number ): any {
    if ( typeof parameterName === 'string' && propertyKey === undefined && parameterIndex === undefined ) {
        return handleAsFactory(namespace + parameterName);
    } else if ( propertyKey !== undefined && typeof parameterIndex === 'number' ) {
        plainDecorator(parameterName, propertyKey, parameterIndex)
    }

}

function handleAsFactory( useName: string ) {
    return ( target: any, propertyKey: Qualifier, parameterIndex: number ) => {
        registerParameterIndexInMetadata(target[propertyKey], useName, parameterIndex)
    };
}

function plainDecorator( target: any, propertyKey: Qualifier, parameterIndex: number  ): void {
    const parameterName = namespace + getNameOfParameter(target[propertyKey], parameterIndex);
    registerParameterIndexInMetadata(target[propertyKey], parameterName, parameterIndex);
}
