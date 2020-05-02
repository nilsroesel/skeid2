"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parameter_descriptor_1 = require("./parameter-descriptor");
function getParameterIndexFromMetadata(from, parameterName) {
    return Reflect.getMetadata(parameterName, from);
}
exports.getParameterIndexFromMetadata = getParameterIndexFromMetadata;
function registerParameterIndexInMetadata(on, parameterName, index) {
    Reflect.defineMetadata(parameterName, index, on);
}
exports.registerParameterIndexInMetadata = registerParameterIndexInMetadata;
function getParameterSerializer(from, parameterName) {
    const registeredSerializer = Reflect.getMetadata(parameterName + ':serializer', from);
    if (typeof registeredSerializer === 'function')
        return registeredSerializer;
    return (identity) => identity;
}
exports.getParameterSerializer = getParameterSerializer;
function registerParameterSerializerInMetadata(on, parameterName, value) {
    Reflect.defineMetadata(parameterName, value, on);
}
exports.registerParameterSerializerInMetadata = registerParameterSerializerInMetadata;
function getParameterFactoryOptions(a, b) {
    let parameterName = undefined;
    let serializer = undefined;
    if (typeof a === 'string') {
        parameterName = a;
    }
    else if (typeof b === 'string') {
        parameterName = b;
    }
    if (typeof a === 'function') {
        serializer = a;
    }
    else if (typeof b === 'function') {
        serializer = b;
    }
    return { parameterName, serializer };
}
exports.getParameterFactoryOptions = getParameterFactoryOptions;
function isParameterFactory(firstArg, secondArg, thirdArg) {
    return (typeof firstArg === 'function' || typeof firstArg === 'string')
        && (typeof secondArg === 'function' || typeof secondArg === 'string' || secondArg === undefined)
        && (typeof thirdArg !== 'number');
}
exports.isParameterFactory = isParameterFactory;
function handleAsFactory(namespace, first, other) {
    const options = getParameterFactoryOptions(first, other);
    return (target, propertyKey, parameterIndex) => {
        let name = options.parameterName;
        if (name === undefined) {
            name = parameter_descriptor_1.getNameOfParameter(target[propertyKey], parameterIndex);
        }
        registerParameterIndexInMetadata(target[propertyKey], namespace + name, parameterIndex);
        if (options.serializer !== undefined) {
            registerParameterSerializerInMetadata(target[propertyKey], namespace + name + ':serializer', options.serializer);
        }
    };
}
exports.handleAsFactory = handleAsFactory;
//# sourceMappingURL=paramter-decorators.js.map