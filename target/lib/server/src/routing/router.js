"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error");
const _1 = require("./");
const decorators_1 = require("../decorators");
const bad_media_type_error_1 = require("../error/bad-media-type-error");
class Router {
    constructor() {
        this.routes = _1.RouteCollection.initializeNew();
    }
    registerRoute(httpMethod, route, restMethod) {
        const routeParts = route.split('/');
        const endpoint = { httpMethod, restMethod };
        this.routes.addSubRoute(routeParts, endpoint);
    }
    routeRequest(httpMethod, url, contentType = decorators_1.MIME_WILDCARD) {
        var _a, _b;
        const calledRoute = (url.pathname || '').split('/');
        const endpointsWithMatchingRoute = this.routes.findEndpointsByRoute(calledRoute);
        if (endpointsWithMatchingRoute.length === 0) {
            throw new error_1.NoSuchRouteError(url);
        }
        const endpointForRequestedHttpMethod = endpointsWithMatchingRoute
            .filter(endpoint => endpoint.httpMethod === httpMethod).filter(e => e !== undefined);
        if (endpointForRequestedHttpMethod.length === 0) {
            throw new error_1.MethodNotAllowedError(httpMethod, (_a = endpointsWithMatchingRoute[0].route) === null || _a === void 0 ? void 0 : _a.join('/'));
        }
        const appliedMimeTypeFilter = endpointForRequestedHttpMethod
            .find(endpoint => decorators_1.getConsumingMimeType(endpoint.restMethod) === contentType) ||
            endpointForRequestedHttpMethod
                .find(endpoint => decorators_1.getConsumingMimeType(endpoint.restMethod) === undefined);
        if (appliedMimeTypeFilter === undefined) {
            throw new bad_media_type_error_1.BadMediaTypeError(((_b = endpointsWithMatchingRoute[0].route) === null || _b === void 0 ? void 0 : _b.join('/')) || url.pathname || '', endpointForRequestedHttpMethod.map(e => decorators_1.getConsumingMimeType(e.restMethod) || decorators_1.MIME_WILDCARD));
        }
        const pathVariables = _1.RouteCollection.parsePathParameters(appliedMimeTypeFilter.route || [], calledRoute);
        return Object.assign(Object.assign({}, appliedMimeTypeFilter), { pathVariables });
    }
}
exports.Router = Router;
exports.router = new Router();
//# sourceMappingURL=router.js.map