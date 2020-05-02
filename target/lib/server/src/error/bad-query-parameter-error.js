"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bad_request_error_1 = require("./bad-request-error");
class BadQueryParameterError extends bad_request_error_1.BadRequestError {
    constructor(requestedSchema) {
        super(`The passed query parameters do not fit to the requested schema: ${requestedSchema}`);
    }
}
exports.BadQueryParameterError = BadQueryParameterError;
//# sourceMappingURL=bad-query-parameter-error.js.map