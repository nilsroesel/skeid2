import { Maybe } from '../../global-types';
export declare class ConfigurationError extends Error {
    constructor(message: string);
}
export declare class InvalidInstanceOnFiledError extends ConfigurationError {
    constructor(className: string, fieldName: string, expectedType: string);
}
export declare type DecoratorType = 'PARAMETER' | 'METHOD' | 'FIELD' | 'CLASS';
export declare type Decorator = ClassDecorator | PropertyDecorator | MethodDecorator | ParameterDecorator;
export declare class UnrecognizedUsageOfDecoratorError extends ConfigurationError {
    constructor(decorator: Function, types: Array<DecoratorType>, usageDefinition?: Maybe<string>);
}
export declare class InvalidDecoratedItemError extends UnrecognizedUsageOfDecoratorError {
    constructor(decorator: Function, allowedDecoratorTypes: Array<DecoratorType>);
}
