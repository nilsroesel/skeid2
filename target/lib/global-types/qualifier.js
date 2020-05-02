"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isQualifier(something) {
    const type = typeof something;
    return type === 'string' || type === 'symbol';
}
exports.isQualifier = isQualifier;
//# sourceMappingURL=qualifier.js.map