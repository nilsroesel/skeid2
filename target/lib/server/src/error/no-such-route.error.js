"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
class NoSuchRouteError extends index_1.ApiError {
    constructor(url) {
        super(404, `Could not find a matching route to the requested url path: ${url.pathname}`);
    }
}
exports.NoSuchRouteError = NoSuchRouteError;
//# sourceMappingURL=no-such-route.error.js.map