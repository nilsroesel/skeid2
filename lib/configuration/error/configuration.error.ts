export class ConfigurationError extends Error {
    constructor( message: string ) {
        super(message);
    }
}

export class InvalidInstanceOnFiledError extends ConfigurationError {
    constructor( className: string, fieldName: string, expectedType: string ) {
        super(`Expected ${ className }[${fieldName}] to be instance of ${ expectedType }.`);
    }
}
