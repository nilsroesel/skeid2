"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../configuration/error");
const appplication_context_1 = require("./appplication-context");
function AfterLoad(target, name, descriptor) {
    var _a;
    if (typeof ((_a = descriptor) === null || _a === void 0 ? void 0 : _a.value) !== 'function') {
        throw new error_1.InvalidDecoratedItemError(AfterLoad, ['METHOD']);
    }
    appplication_context_1.modifiableApplicationContext.addAfterLoad(target.constructor, name);
}
exports.AfterLoad = AfterLoad;
//# sourceMappingURL=after-load.js.map