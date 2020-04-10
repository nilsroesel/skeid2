import { ConfigurationError } from './configuration.error';

export class RestConfigurationError extends ConfigurationError {
    constructor( message: string ) {
        super(message);
    }
}

export class ClashingRoutesError extends RestConfigurationError {
    constructor( route: Array<string>, clashingWith: Array<string> ) {
        super(`The route <<${ route.join('/') }>> clashes with an existing route <<${ clashingWith.join('/') }>>.`);
    }
}

export class DuplicatedEndpointError extends RestConfigurationError {
    constructor( route: Array<string>, httpMethod: string ) {
        super(`The route <<${ route.join('/') }>> for the HTTP-Method ${ httpMethod } already exists.`);
    }
}

export class InvalidDecoratedItemError extends RestConfigurationError {
    constructor( clazz: Object, decoratedItem: string | symbol ) {
        super('An item decorated with @Get/@Post/@Put/@Patch/@Delete must be a method.' +
            `Check your configuration at: ${ clazz.constructor }.${ getStringOf(decoratedItem) }.`
        );
    }
}

export class SpecifiedPathParameterHasNoNameError extends RestConfigurationError {
    constructor() {
        super('A specified path parameter (route parts starting with :) needs an identifier.');
    }
}

function getStringOf( something: string | symbol ): string | never {
    if ( typeof something === 'string' ) return something;
    if ( typeof something === 'symbol' ) return something.toString();
    throw new Error(`Tried to covert [string | symbol] to string. But ${ something } is nothing of both.`);
}
