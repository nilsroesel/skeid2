"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
const url_1 = require("url");
const router_1 = require("../src/routing/router");
const error_1 = require("../../configuration/error");
const error_2 = require("../src/error");
const consumes_1 = require("../src/decorators/consumes");
describe('Test Router and routing', () => {
    let router;
    beforeEach(() => {
        router = new router_1.Router();
    });
    it('Should find mapped routes', () => {
        router.registerRoute('GET', '/users/count', () => 0);
        router.registerRoute('GET', '/users', () => []);
        router.registerRoute('GET', '/api-version', () => 'v0-test');
        expect(router.routeRequest('GET', url_1.parse('/users/count')).restMethod())
            .toEqual(0);
        expect(router.routeRequest('GET', url_1.parse('/users')).restMethod())
            .toEqual([]);
        expect(router.routeRequest('GET', url_1.parse('/api-version')).restMethod())
            .toEqual('v0-test');
    });
    it('Should not register single route parts', () => {
        router.registerRoute('GET', '/users/count', () => undefined);
        expect(() => router.routeRequest('GET', url_1.parse('/users')))
            .toThrowMatching(thrown => (thrown instanceof error_2.NoSuchRouteError));
        expect(() => router.routeRequest('GET', url_1.parse('/users/')))
            .toThrowMatching(thrown => (thrown instanceof error_2.NoSuchRouteError));
    });
    it('Should work with path parameters', () => {
        const user1 = { id: 1, name: 'user1' };
        router.registerRoute('GET', '/users', () => [user1]);
        router.registerRoute('GET', '/users/count', () => 1);
        router.registerRoute('GET', '/users/count/contacts', () => 1);
        router.registerRoute('GET', '/users/{id}', () => user1);
        router.registerRoute('GET', '/users/{id}/contacts', () => []);
        expect(router.routeRequest('GET', url_1.parse('/users/count')).restMethod())
            .toEqual(1);
        expect(router.routeRequest('GET', url_1.parse('/users/count/contacts')).restMethod())
            .toEqual(1);
        expect(router.routeRequest('GET', url_1.parse('/users')).restMethod())
            .toEqual([user1]);
        expect(router.routeRequest('GET', url_1.parse('/users/1')).restMethod())
            .toEqual(user1);
        expect(router.routeRequest('GET', url_1.parse('/users/1/contacts')).restMethod())
            .toEqual([]);
    });
    it('Should assign the correct path variables', () => {
        router.registerRoute('GET', '/users/{id}', () => undefined);
        expect(router.routeRequest('GET', url_1.parse('/users/1')).pathVariables)
            .toEqual({ id: '1' });
    });
    it('Should map same routes with different methods', () => {
        router.registerRoute('GET', '/users', () => 200);
        router.registerRoute('POST', '/users', () => 201);
        router.registerRoute('DELETE', '/users', () => 204);
        expect(router.routeRequest('GET', url_1.parse('/users')).restMethod())
            .toEqual(200);
        expect(router.routeRequest('POST', url_1.parse('/users')).restMethod())
            .toEqual(201);
        expect(router.routeRequest('DELETE', url_1.parse('/users')).restMethod())
            .toEqual(204);
    });
    it('Should throw an NoSuchRouteError if route does not exist', () => {
        expect(() => router.routeRequest('GET', url_1.parse('/users')))
            .toThrowMatching(thrown => (thrown instanceof error_2.NoSuchRouteError));
    });
    it('Should throw an MethodNotAllowedError if route does exist and the method is not defined', () => {
        router.registerRoute('GET', '/users', () => 200);
        expect(() => router.routeRequest('POST', url_1.parse('/users')))
            .toThrowMatching(thrown => (thrown instanceof error_2.MethodNotAllowedError));
    });
    it('Should not be possible to register the same route twice', () => {
        expect(() => {
            router.registerRoute('GET', '/users/', () => undefined);
            router.registerRoute('GET', '/users/', () => undefined);
        }).toThrowMatching(thrown => (thrown instanceof error_1.DuplicatedEndpointError));
    });
    it('Should be possible to register the same route with same http, but different accept-mime', () => {
        class Test {
            withMetadata() { return 1; }
        }
        consumes_1.Consumes('application/json')(Test.prototype, 'withMetadata');
        router.registerRoute('GET', '/users/', () => undefined);
        router.registerRoute('GET', '/users/', Test.prototype.withMetadata);
        expect(router.routeRequest('GET', url_1.parse('/users/'), 'application/json').restMethod())
            .toEqual(1);
        expect(router.routeRequest('GET', url_1.parse('/users/')).restMethod())
            .toBeUndefined();
    });
    it('Should not be possible to register two path variables at the same level', () => {
        expect(() => {
            router.registerRoute('GET', '/users/{id}', () => undefined);
            router.registerRoute('GET', '/users/{foo}', () => undefined);
        }).toThrowMatching(thrown => (thrown instanceof error_1.ClashingRoutesError));
    });
});
//# sourceMappingURL=RouterIT.js.map