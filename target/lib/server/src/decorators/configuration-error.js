"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfigurationError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.ConfigurationError = ConfigurationError;
var InvalidFrameworkServerConfiguration;
(function (InvalidFrameworkServerConfiguration) {
    InvalidFrameworkServerConfiguration["INVALID_REST_CONTROL"] = "An item decorated with @Get/@Post/@Patch/@Delete must be callable.";
})(InvalidFrameworkServerConfiguration = exports.InvalidFrameworkServerConfiguration || (exports.InvalidFrameworkServerConfiguration = {}));
//# sourceMappingURL=configuration-error.js.map