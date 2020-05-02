"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfigurationError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.ConfigurationError = ConfigurationError;
class InvalidInstanceOnFiledError extends ConfigurationError {
    constructor(className, fieldName, expectedType) {
        super(`Expected ${className}[${fieldName}] to be instance of ${expectedType}.`);
    }
}
exports.InvalidInstanceOnFiledError = InvalidInstanceOnFiledError;
class UnrecognizedUsageOfDecoratorError extends ConfigurationError {
    constructor(decorator, types, usageDefinition) {
        super(`@${decorator.name}() can only be applied on [${types.join(',')}].${usageDefinition !== undefined ? '\n'.concat(usageDefinition).concat('.') : ''}`);
    }
}
exports.UnrecognizedUsageOfDecoratorError = UnrecognizedUsageOfDecoratorError;
class InvalidDecoratedItemError extends UnrecognizedUsageOfDecoratorError {
    constructor(decorator, allowedDecoratorTypes) {
        super(decorator, allowedDecoratorTypes);
    }
}
exports.InvalidDecoratedItemError = InvalidDecoratedItemError;
//# sourceMappingURL=configuration.error.js.map