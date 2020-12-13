import { Url } from 'url';
import { MethodNotAllowedError, NoSuchRouteError } from '../error';
import { AssignedPathVariables, RegisteredEndpoint, RouteCollection } from './';
import { Maybe } from '../../../global-types';
import { getConsumingMimeType, MIME_WILDCARD } from '../decorators';
import { BadMediaTypeError } from '../error/bad-media-type-error';

export class Router {

    private readonly routes: RouteCollection = RouteCollection.initializeNew();

    constructor() {}

    public registerRoute( httpMethod: string, route: string, restMethod: Function ) {
        const routeParts: Array<string> = route.split('/');
        const endpoint: RegisteredEndpoint = { httpMethod, restMethod };
        this.routes.addSubRoute(routeParts, endpoint);
    }

    public routeRequest( httpMethod: string, url: Url, contentType: Maybe<string> = MIME_WILDCARD ): RegisteredEndpoint & AssignedPathVariables {
        const calledRoute: Array<string> = (url.pathname || '').split('/');

        const endpointsWithMatchingRoute: Array<RegisteredEndpoint>
            = this.routes.findEndpointsByRoute(calledRoute);

        if ( endpointsWithMatchingRoute.length === 0 ) {
            throw new NoSuchRouteError(url);
        }

        const endpointForRequestedHttpMethod: Array<RegisteredEndpoint> = endpointsWithMatchingRoute
            .filter(endpoint => endpoint.httpMethod === httpMethod).filter(e => e!== undefined);

        if ( endpointForRequestedHttpMethod.length === 0 ) {
            throw new MethodNotAllowedError(httpMethod, endpointsWithMatchingRoute[0].route?.join('/'))
        }

        const appliedMimeTypeFilter: Maybe<RegisteredEndpoint> = endpointForRequestedHttpMethod
            .find(endpoint => getConsumingMimeType(endpoint.restMethod) === contentType) ||
            endpointForRequestedHttpMethod
                .find(endpoint => getConsumingMimeType(endpoint.restMethod) === undefined);

        if ( appliedMimeTypeFilter === undefined ) {
            throw new BadMediaTypeError(
                endpointsWithMatchingRoute[0].route?.join('/') || url.pathname || '',
                endpointForRequestedHttpMethod.map(e => getConsumingMimeType(e.restMethod) || MIME_WILDCARD))
        }

        const pathVariables = RouteCollection.parsePathParameters(appliedMimeTypeFilter.route || [],
            calledRoute);

        return { ...appliedMimeTypeFilter, pathVariables };
    }
}

export const router: Router = new Router();


