"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_error_1 = require("./api.error");
class MethodNotAllowedError extends api_error_1.ApiError {
    constructor(method, path = '') {
        super(405, `Method: ${method.toUpperCase()} is not allowed on the specified path ${path}`);
    }
}
exports.MethodNotAllowedError = MethodNotAllowedError;
//# sourceMappingURL=method-not-allowed.error.js.map