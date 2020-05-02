"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_error_1 = require("./api.error");
class ResourceNotFoundError extends api_error_1.ApiError {
    constructor(resource) {
        super(404, `Resource ${resource} not found`);
    }
}
exports.ResourceNotFoundError = ResourceNotFoundError;
//# sourceMappingURL=resource-not-found.error.js.map