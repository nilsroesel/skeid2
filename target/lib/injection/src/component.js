"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const internal_1 = require("./internal");
const global_types_1 = require("../../global-types");
function Component(qualifier) {
    if (global_types_1.isQualifier(qualifier)) {
        return handleAsDecoratorFactory(qualifier);
    }
    else if (global_types_1.isInstantiable(qualifier)) {
        return handleAsPlainDecorator(qualifier);
    }
    throw new Error('Invalid argument for component decorator');
}
exports.Component = Component;
function handleAsDecoratorFactory(qualifier) {
    if (!global_types_1.isQualifier(qualifier)) {
        throw new Error('Invalid Qualifier');
    }
    return (clazz) => {
        internal_1.modifiableApplicationContext.registerDependency(clazz, String(qualifier));
    };
}
function handleAsPlainDecorator(clazz) {
    internal_1.modifiableApplicationContext.registerDependency(clazz);
}
//# sourceMappingURL=component.js.map