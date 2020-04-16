import { Maybe } from '../../global-types';

export class ConfigurationError extends Error {
    constructor( message: string ) {
        super(message);
    }
}

export class InvalidInstanceOnFiledError extends ConfigurationError {
    constructor( className: string, fieldName: string, expectedType: string ) {
        super(`Expected ${ className }[${ fieldName }] to be instance of ${ expectedType }.`);
    }
}

export type DecoratorType = 'PARAMETER' | 'METHOD' | 'FIELD' | 'CLASS';
export type Decorator = ClassDecorator | PropertyDecorator | MethodDecorator | ParameterDecorator;

export class UnrecognizedUsageOfDecoratorError extends ConfigurationError {
    constructor( decorator: Function, types: Array<DecoratorType>, usageDefinition?: Maybe<string> ) {
        super(`@${ decorator.name }() can only be applied on [${ types.join(',') }].${ 
            usageDefinition !== undefined ? '\n'.concat(usageDefinition).concat('.') : ''
        }`);
    }
}

export class InvalidDecoratedItemError extends UnrecognizedUsageOfDecoratorError {
    constructor( decorator: Function, allowedDecoratorTypes: Array<DecoratorType> ) {
        super(decorator, allowedDecoratorTypes);
    }
}



