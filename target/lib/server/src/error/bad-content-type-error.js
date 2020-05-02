"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bad_request_error_1 = require("./bad-request-error");
class BadContentTypeError extends bad_request_error_1.BadRequestError {
    constructor(content, expectedType) {
        super(`<<${content}>> is no valid ${expectedType}-Data `);
    }
}
exports.BadContentTypeError = BadContentTypeError;
//# sourceMappingURL=bad-content-type-error.js.map