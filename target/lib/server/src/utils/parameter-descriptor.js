"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
function getNameOfParameter(ofFunction, parameterIndex) {
    const functionString = ofFunction.toString();
    const indexOfOpeningBrace = functionString.indexOf('(') + 1;
    const indexOfClosingBrace = functionString.indexOf(')');
    const argumentContent = functionString.slice(indexOfOpeningBrace, indexOfClosingBrace);
    const parameterNames = argumentContent.split(' ').map(name => name.replace(',', ''));
    const parameterNameAtIndex = parameterNames[parameterIndex];
    if (parameterNameAtIndex === undefined)
        throw new Error('No parameter on this index');
    const isRestOperatorArgument = parameterNameAtIndex.startsWith('...');
    if (isRestOperatorArgument)
        throw new Error('Rest Operator is not supported');
    return parameterNameAtIndex;
}
exports.getNameOfParameter = getNameOfParameter;
function Test(target, key, index) {
    callDescribedParameterDecorator(target, key, index, () => { });
}
exports.Test = Test;
function callDescribedParameterDecorator(target, key, index, decorateWith) {
    const name = getNameOfParameter(target[key], index);
    const types = Reflect.getMetadata('design:paramtypes', target, key);
    decorateWith(target, key, { name, index, type: 'any' });
}
exports.callDescribedParameterDecorator = callDescribedParameterDecorator;
//# sourceMappingURL=parameter-descriptor.js.map