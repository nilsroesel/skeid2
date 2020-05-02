"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isInstantiable(something) {
    var _a, _b;
    return ((_b = (_a = something) === null || _a === void 0 ? void 0 : _a.prototype) === null || _b === void 0 ? void 0 : _b.constructor) !== undefined;
}
exports.isInstantiable = isInstantiable;
//# sourceMappingURL=instantiable.js.map