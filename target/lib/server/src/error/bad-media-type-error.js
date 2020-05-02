"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_error_1 = require("./api.error");
class BadMediaTypeError extends api_error_1.ApiError {
    constructor(operationPath, accepted = []) {
        super(415, `Unsupported media type for operation ${operationPath}. Acceptable: ${accepted.join(';')}`);
    }
}
exports.BadMediaTypeError = BadMediaTypeError;
//# sourceMappingURL=bad-media-type-error.js.map