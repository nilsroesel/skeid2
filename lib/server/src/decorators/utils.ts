import 'reflect-metadata';
import { Qualifier } from '../../../global-types';

export function decoratedItemIsMethod( something: unknown ): something is Function {
    return typeof something === 'function';
}

export function copyMetadata( from: any, to: any ): void {
    Reflect.getOwnMetadataKeys(from).forEach(metadataKey => {
       const metadata: any = Reflect.getOwnMetadata(metadataKey, from);
       Reflect.defineMetadata(metadataKey, metadata, to);
    });
}

export function getNameOfParameter( ofFunction: Function, parameterIndex: number ): string | never {
    const functionString = ofFunction.toString();
    const indexOfOpeningBrace = functionString.indexOf('(') + 1;
    const indexOfClosingBrace = functionString.indexOf(')');
    const argumentContent = functionString.slice(indexOfOpeningBrace, indexOfClosingBrace);
    const parameterNames = argumentContent.split(' ').map(name => name.replace(',', ''));
    const parameterNameAtIndex = parameterNames[parameterIndex];

    if ( parameterNameAtIndex === undefined ) throw new Error('No parameter on this index');
    const isRestOperatorArgument = parameterNameAtIndex.startsWith('...');
    if ( isRestOperatorArgument ) throw new Error('Rest Operator is not supported');

    return parameterNameAtIndex;
}

/* Specific for @PathVariable and @QueryParameter */

export type SecondArgument = Qualifier | Function | undefined;
export function getParameterIndexFromMetadata( from: Function, parameterName: string ): number | undefined {
    return Reflect.getMetadata(parameterName, from);
}

export function registerParameterIndexInMetadata( on: Function, parameterName: string, index: number ): void {
    Reflect.defineMetadata(parameterName, index, on);
}

export function getParameterSerializer( from: Function, parameterName: string ): Function {
    const registeredSerializer = Reflect.getMetadata(parameterName + ':serializer', from);
    if ( typeof  registeredSerializer === 'function' ) return registeredSerializer;
    return <T>(identity: T) => identity;
}

export function registerParameterSerializerInMetadata( on: Function, parameterName: string, value: Function ): void {
    Reflect.defineMetadata(parameterName, value, on);
}

export interface ParameterDecoratorFactoryOptions {
    parameterName: string | undefined;
    serializer: Function | undefined;
}

export type FactoryArgument = Function | string | undefined;

export function getParameterFactoryOptions( a: FactoryArgument, b: FactoryArgument ): ParameterDecoratorFactoryOptions {
    let parameterName: string | undefined = undefined;
    let serializer: Function | undefined = undefined;

    if ( typeof a === 'string' ) {
        parameterName = a;
    } else if ( typeof b === 'string' ) {
        parameterName = b;
    }

    if ( typeof a === 'function' ) {
        serializer = a;
    } else if ( typeof b === 'function' ) {
        serializer = b;
    }

    return { parameterName, serializer };
}

export function isParameterFactory( firstArg: unknown, secondArg: unknown, thirdArg: unknown ): boolean {
    return (typeof firstArg === 'function' || typeof firstArg === 'string')
        && (typeof secondArg === 'function' || typeof secondArg === 'string' || secondArg === undefined)
        && (typeof thirdArg !== 'number');
}

export function handleAsFactory( namespace: string, first: string | Function, other?: string | Function | undefined ) {
    const options = getParameterFactoryOptions(first, other);

    return ( target: any, propertyKey: Qualifier, parameterIndex: number ) => {
        let name = options.parameterName;
        if ( name === undefined ) {
            name = getNameOfParameter(target[propertyKey], parameterIndex);
        }
        registerParameterIndexInMetadata(target[propertyKey],
            namespace + name,
            parameterIndex);

        if ( options.serializer !== undefined ) {
            registerParameterSerializerInMetadata(
                target[propertyKey],
                namespace + name + ':serializer',
                options.serializer
            );
        }
    };
}


