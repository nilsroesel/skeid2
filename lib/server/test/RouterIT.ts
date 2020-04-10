import 'jasmine';
import { Router } from '../src/routing/router';
import { mockUrl } from './helpers';
import { ClashingRoutesError, DuplicatedEndpointError } from '../../configuration/error';
import { MethodNotAllowedError, NoSuchRouteError } from '../src/error';

describe('Test Router and routing', () => {
    let router: Router;

    beforeEach(() => {
        router = new Router();
    });

    it('Should find mapped routes', () => {
        router.registerRoute('GET','/users/count', () => 0);
        router.registerRoute('GET','/users', () => []);
        router.registerRoute('GET','/api-version', () => 'v0-test');

        expect(router.routeRequest('GET', mockUrl('/users/count'))())
            .toEqual(0);
        expect(router.routeRequest('GET', mockUrl('/users'))())
            .toEqual([]);
        expect(router.routeRequest('GET', mockUrl('/api-version'))())
            .toEqual('v0-test');
    });

    it('Should not register single route parts', () => {
        router.registerRoute('GET','/users/count', () => undefined);
        expect(() => router.routeRequest('GET', mockUrl('/users')))
            .toThrowMatching(thrown => (thrown instanceof NoSuchRouteError));
        expect(() => router.routeRequest('GET', mockUrl('/users/')))
            .toThrowMatching(thrown => (thrown instanceof NoSuchRouteError));
    });

    it('Should work with path parameters', () => {
        const user1 = { id: 1, name: 'user1' };
        router.registerRoute('GET','/users', () => [user1]);
        router.registerRoute('GET','/users/count', () => 1);
        router.registerRoute('GET','/users/count/contacts', () => 1);
        router.registerRoute('GET','/users/{id}', () => user1);
        router.registerRoute('GET','/users/{id}/contacts', () => []);

        expect(router.routeRequest('GET', mockUrl('/users/count'))())
            .toEqual(1);
        expect(router.routeRequest('GET', mockUrl('/users/count/contacts'))())
            .toEqual(1);
        expect(router.routeRequest('GET', mockUrl('/users'))())
            .toEqual([user1]);
        expect(router.routeRequest('GET', mockUrl('/users/1'))())
            .toEqual(user1);
        expect(router.routeRequest('GET', mockUrl('/users/1/contacts'))())
            .toEqual([]);
    });

    it('Should map same routes with different methods', () => {
        router.registerRoute('GET','/users', () => 200);
        router.registerRoute('POST','/users', () => 201);
        router.registerRoute('DELETE','/users', () => 204);

        expect(router.routeRequest('GET', mockUrl('/users'))())
            .toEqual(200);
        expect(router.routeRequest('POST', mockUrl('/users'))())
            .toEqual(201);
        expect(router.routeRequest('DELETE', mockUrl('/users'))())
            .toEqual(204);
    });

    it('Should throw an NoSuchRouteError if route does not exist', () => {
        expect(() => router.routeRequest('GET', mockUrl('/users')))
            .toThrowMatching(thrown => (thrown instanceof NoSuchRouteError));
    });

    it('Should throw an MethodNotAllowedError if route does exist and the method is not defined', () => {
        router.registerRoute('GET','/users', () => 200);
        expect(() => router.routeRequest('POST', mockUrl('/users')))
            .toThrowMatching(thrown => (thrown instanceof MethodNotAllowedError));
    });

    it('Should not be possible to register the same route twice', () => {
        expect(() => {
            router.registerRoute('GET','/users/', () => undefined);
            router.registerRoute('GET','/users/', () => undefined);
        }).toThrowMatching(thrown => (thrown instanceof DuplicatedEndpointError))
    });

    it('Should not be possible to register two path variables at the same level', () => {
        expect(() => {
            router.registerRoute('GET','/users/{id}', () => undefined);
            router.registerRoute('GET','/users/{foo}', () => undefined);
        }).toThrowMatching(thrown => (thrown instanceof ClashingRoutesError))
    });

});
