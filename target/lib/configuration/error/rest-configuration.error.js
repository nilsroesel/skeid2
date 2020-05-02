"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_error_1 = require("./configuration.error");
class RestConfigurationError extends configuration_error_1.ConfigurationError {
    constructor(message) {
        super(message);
    }
}
exports.RestConfigurationError = RestConfigurationError;
class ClashingRoutesError extends RestConfigurationError {
    constructor(route, clashingWith) {
        super(`The route <<${route.join('/')}>> clashes with an existing route <<${clashingWith.join('/')}>>.`);
    }
}
exports.ClashingRoutesError = ClashingRoutesError;
class DuplicatedEndpointError extends RestConfigurationError {
    constructor(route, httpMethod) {
        super(`The route <<${route.join('/')}>> for the HTTP-Method ${httpMethod} already exists.`);
    }
}
exports.DuplicatedEndpointError = DuplicatedEndpointError;
class SpecifiedPathParameterHasNoNameError extends RestConfigurationError {
    constructor() {
        super('A specified path parameter (route parts starting with :) needs an identifier.');
    }
}
exports.SpecifiedPathParameterHasNoNameError = SpecifiedPathParameterHasNoNameError;
//# sourceMappingURL=rest-configuration.error.js.map