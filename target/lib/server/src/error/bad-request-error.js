"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_error_1 = require("./api.error");
class BadRequestError extends api_error_1.ApiError {
    constructor(message = 'Bad Request') {
        super(400, message);
    }
}
exports.BadRequestError = BadRequestError;
//# sourceMappingURL=bad-request-error.js.map