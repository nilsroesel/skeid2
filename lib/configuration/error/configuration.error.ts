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
export class InvalidDecoratedItemError extends ConfigurationError {
    constructor( decorator: Function, allowedDecoratorTypes: Array<DecoratorType> ) {
        super(`${ decorator.name } can only be applied on [${ allowedDecoratorTypes.join(',') }]`)
    }
}

