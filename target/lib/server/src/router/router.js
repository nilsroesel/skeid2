"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error");
class Router {
    constructor() {
        this.routes = RouteCollection.initializeNew();
    }
    registerRoute(httpMethod, route, restMethod) {
        const routeParts = route.split('/');
        const endpoint = { httpMethod, restMethod };
        this.routes.addSubRoute(routeParts, endpoint);
    }
    routeRequest(httpMethod, url) {
        var _a;
        const calledRoute = url.pathname.split('/');
        const endpointsWithMatchingRoute = this.routes.findEndpointsByRoute(calledRoute);
        if (endpointsWithMatchingRoute.length === 0) {
            throw new error_1.NoSuchRouteError(url);
        }
        const endpointForRequestedHttpMethod = endpointsWithMatchingRoute
            .find(endpoint => endpoint.httpMethod === httpMethod);
        if (endpointForRequestedHttpMethod === undefined) {
            throw new error_1.MethodNotAllowedError(httpMethod, (_a = endpointsWithMatchingRoute[0].route) === null || _a === void 0 ? void 0 : _a.join('/'));
        }
        return endpointForRequestedHttpMethod.restMethod;
    }
}
exports.Router = Router;
exports.router = new Router();
//# sourceMappingURL=router.js.map