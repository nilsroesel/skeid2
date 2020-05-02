"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../../configuration/error");
const _1 = require("./");
const decorators_1 = require("../decorators");
class RouteCollection {
    constructor(route, fullQualifiedRoute = [route.getPart()]) {
        this.route = route;
        this.fullQualifiedRoute = fullQualifiedRoute;
        this.subRoutes = new Array();
        this.endpoints = new Array();
    }
    static initializeNew() {
        return new RouteCollection(_1.RoutePart.constructFromString(''));
    }
    static parsePathParameters(route, urlPath) {
        const pathParameters = {};
        route.map(_1.RoutePart.constructFromString)
            .map((part, index) => ({ part, index }))
            .filter(i => i.part.isPathVariable())
            .forEach(pathVariableWithIndex => {
            const parameterName = pathVariableWithIndex.part.getName();
            const parameterValue = urlPath[pathVariableWithIndex.index];
            Object.assign(pathParameters, { [parameterName]: parameterValue });
        });
        return pathParameters;
    }
    addSubRoute(subRoute, endpoint) {
        // TODO throw if subRoutes contains undefined/null
        if (subRoute.length === 0)
            return;
        const currentPart = _1.RoutePart.constructFromString(subRoute[0]);
        if (currentPart.getPart() === this.route.getPart()) {
            this.addSubRoute(subRoute.slice(1), endpoint);
            return;
        }
        const newChild = this.addChild(currentPart);
        if (subRoute.length === 1) {
            if (newChild.endpointExistsWithMimeTypeAndHttpMethod(endpoint.httpMethod, endpoint.restMethod)) {
                throw new error_1.DuplicatedEndpointError(newChild.fullQualifiedRoute, endpoint.httpMethod);
            }
            newChild.endpoints.push(Object.assign(Object.assign({}, endpoint), { route: newChild.fullQualifiedRoute }));
        }
        newChild.addSubRoute(subRoute.slice(1), endpoint);
    }
    findEndpointsByRoute(route) {
        var _a, _b;
        if (route.length === 0)
            return [];
        if (route.length === 1)
            return this.endpoints;
        if (this.route.matchesSplitedUrlPart(route[0])) {
            const nextPart = _1.RoutePart.constructFromString(route[1]);
            const childWithExactString = this.getChild(nextPart);
            const childAsPathVariable = this.getPathVariable();
            return ((_a = childWithExactString) === null || _a === void 0 ? void 0 : _a.findEndpointsByRoute(route.slice(1))) || ((_b = childAsPathVariable) === null || _b === void 0 ? void 0 : _b.findEndpointsByRoute(route.slice(1))) || [];
        }
        return [];
    }
    addChild(routePart) {
        var _a;
        const existingRoutePart = this.getChild(routePart);
        if (existingRoutePart !== undefined) {
            return existingRoutePart;
        }
        if (routePart.isPathVariable() && this.hasAlreadyPathVariableAsChild()) {
            throw new error_1.ClashingRoutesError(this.fullQualifiedRoute.concat(routePart.getPart()), ((_a = this.getPathVariable()) === null || _a === void 0 ? void 0 : _a.fullQualifiedRoute) || []);
        }
        const newSubRoute = new RouteCollection(routePart, this.fullQualifiedRoute.concat(routePart.getPart()));
        this.subRoutes.push(newSubRoute);
        return newSubRoute;
    }
    getChild(routePart) {
        return this.subRoutes.find(part => part.route.getPart() === routePart.getPart());
    }
    getPathVariable() {
        return this.subRoutes.find(part => part.route.isPathVariable());
    }
    hasAlreadyPathVariableAsChild() {
        return this.subRoutes.find(part => part.route.isPathVariable()) !== undefined;
    }
    endpointExistsWithMimeTypeAndHttpMethod(httpMethod, restMethod) {
        return this.endpoints
            .filter(e => e.httpMethod === httpMethod)
            .map(e => e.restMethod)
            .find(fn => decorators_1.getConsumingMimeType(fn) === decorators_1.getConsumingMimeType(restMethod)) !== undefined;
    }
}
exports.RouteCollection = RouteCollection;
//# sourceMappingURL=route-collection.js.map