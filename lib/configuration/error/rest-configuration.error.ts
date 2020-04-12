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

export class SpecifiedPathParameterHasNoNameError extends RestConfigurationError {
    constructor() {
        super('A specified path parameter (route parts starting with :) needs an identifier.');
    }
}
