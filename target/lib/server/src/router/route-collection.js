"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../../configuration/error");
var Routing;
(function (Routing) {
    class RouteCollection {
        constructor(route, fullQualifiedRoute = [route.getPart()]) {
            this.route = route;
            this.fullQualifiedRoute = fullQualifiedRoute;
            this.subRoutes = new Array();
            this.endpoints = new Array();
        }
        static initializeNew() {
            return new RouteCollection(RoutePart.constructFromString(''));
        }
        addSubRoute(subRoute, endpoint) {
            // TODO throw if subRoutes contains undefined/null
            if (subRoute.length === 0)
                return;
            const currentPart = RoutePart.constructFromString(subRoute[0]);
            if (currentPart.getPart() === this.route.getPart()) {
                this.addSubRoute(subRoute.slice(1), endpoint);
                return;
            }
            const newChild = this.addChild(currentPart);
            if (subRoute.length === 1) {
                if (newChild.endpointForHttpMethodAlreadyExists(endpoint.httpMethod)) {
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
                const nextPart = RoutePart.constructFromString(route[1]);
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
        endpointForHttpMethodAlreadyExists(httpMethod) {
            return this.endpoints.find(e => e.httpMethod === httpMethod) !== undefined;
        }
    }
    Routing.RouteCollection = RouteCollection;
})(Routing = exports.Routing || (exports.Routing = {}));
//# sourceMappingURL=route-collection.js.map