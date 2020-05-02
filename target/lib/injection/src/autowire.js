"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const internal_1 = require("./internal");
const global_types_1 = require("../../global-types");
function Autowired(qualifier, key) {
    if ((global_types_1.isInstantiable(qualifier) || global_types_1.isQualifier(qualifier)) && key === undefined) {
        return handleAsDecoratorFactory(qualifier);
    }
    if (typeof key === 'string') {
        return handleAsPlainDecorator(qualifier, key);
    }
}
exports.Autowired = Autowired;
function handleAsDecoratorFactory(qualifier) {
    let qualifyingName;
    if (global_types_1.isInstantiable(qualifier)) {
        qualifyingName = qualifier.name;
    }
    else if (global_types_1.isQualifier(qualifier)) {
        qualifyingName = String(qualifier);
    }
    else {
        throw new Error('Unexpected qualifier of dependency');
    }
    return (target, key) => {
        internal_1.modifiableApplicationContext.add(qualifyingName, { target, key });
    };
}
function handleAsPlainDecorator(target, key) {
    const field = Reflect.getMetadata('design:type', target, key);
    if (!field) {
        throw new Error(`Circular Dependency detected.
                The reflection api will return undefined if so.
                This issue is related to circular dependencies in typescripts module resolution.
                Check out the following discussions for the issue
                https://github.com/Microsoft/TypeScript/issues/4521
                https://github.com/Microsoft/TypeScript/issues/20361
                If this general issue is solved, the circular dependencies would work here without issues.
            `);
    }
    internal_1.modifiableApplicationContext.add(field.name, { target, key });
}
//# sourceMappingURL=autowire.js.map