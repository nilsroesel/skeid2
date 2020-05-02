import 'reflect-metadata';
import { Maybe, Qualifier } from '../../../global-types';
export declare function decoratedItemIsMethod(something: unknown): something is Function;
export declare function copyMetadata(from: any, to: any): void;
export declare function assignOnlyDefinedMetadata<T>(to: any, metadata: string | symbol, value: Maybe<T>): void;
export declare function getNameOfParameter(ofFunction: Function, parameterIndex: number): string | never;
export declare type SecondArgument = Qualifier | Function | undefined;
export declare function getParameterIndexFromMetadata(from: Function, parameterName: string): number | undefined;
export declare function registerParameterIndexInMetadata(on: Function, parameterName: string, index: number): void;
export declare function getParameterSerializer(from: Function, parameterName: string): Function;
export declare function registerParameterSerializerInMetadata(on: Function, parameterName: string, value: Function): void;
export interface ParameterDecoratorFactoryOptions {
    parameterName: string | undefined;
    serializer: Function | undefined;
}
export declare type FactoryArgument = Function | string | undefined;
export declare function getParameterFactoryOptions(a: FactoryArgument, b: FactoryArgument): ParameterDecoratorFactoryOptions;
export declare function isParameterFactory(firstArg: unknown, secondArg: unknown, thirdArg: unknown): boolean;
export declare function handleAsFactory(namespace: string, first: string | Function, other?: string | Function | undefined): (target: any, propertyKey: Qualifier, parameterIndex: number) => void;
