"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(code, message) {
        super();
        this.code = code;
        this.message = message;
    }
    get name() {
        return this.constructor.name;
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=api.error.js.map