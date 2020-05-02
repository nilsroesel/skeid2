"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../routing/router");
const url_1 = require("url");
class HttpRequestListener {
    listener() {
        return (request, response) => {
            if (request.method === undefined || request.url === undefined)
                return;
            const functionOnEndpoint = router_1.router.routeRequest(request.method, new url_1.URL(request.url));
        };
    }
}
exports.HttpRequestListener = HttpRequestListener;
//# sourceMappingURL=request-listener.js.map