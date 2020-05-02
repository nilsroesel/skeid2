import { ConfigurationError } from './configuration.error';
export declare class RestConfigurationError extends ConfigurationError {
    constructor(message: string);
}
export declare class ClashingRoutesError extends RestConfigurationError {
    constructor(route: Array<string>, clashingWith: Array<string>);
}
export declare class DuplicatedEndpointError extends RestConfigurationError {
    constructor(route: Array<string>, httpMethod: string);
}
export declare class SpecifiedPathParameterHasNoNameError extends RestConfigurationError {
    constructor();
}
