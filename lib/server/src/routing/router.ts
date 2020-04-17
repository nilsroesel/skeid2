import { Url } from 'url';
import { MethodNotAllowedError, NoSuchRouteError } from '../error';
import { AssignedPathVariables, RegisteredEndpoint, RouteCollection } from './';

export class Router {

    private readonly routes: RouteCollection = RouteCollection.initializeNew();

    constructor() {}

    public registerRoute<T>( httpMethod: string, route: string, restMethod: Function ) {
            const routeParts: Array<string> = route.split('/');
            const endpoint: RegisteredEndpoint<T> = { httpMethod, restMethod };

            this.routes.addSubRoute(routeParts, endpoint);
    }

    routeRequest( httpMethod: string, url: Url ): RegisteredEndpoint<unknown> & AssignedPathVariables {
        const calledRoute: Array<string> = (url.pathname || '').split('/');

        const endpointsWithMatchingRoute: Array<RegisteredEndpoint<any>>
            = this.routes.findEndpointsByRoute(calledRoute);

        if ( endpointsWithMatchingRoute.length === 0 ) {
            throw new NoSuchRouteError(url);
        }

        const endpointForRequestedHttpMethod: RegisteredEndpoint<any> | undefined = endpointsWithMatchingRoute
            .find(endpoint => endpoint.httpMethod === httpMethod);

        if ( endpointForRequestedHttpMethod === undefined ) {
            throw new MethodNotAllowedError(httpMethod, endpointsWithMatchingRoute[0].route?.join('/'))
        }

        const pathVariables = RouteCollection.parsePathParameters(endpointForRequestedHttpMethod.route || [],
            calledRoute);

        return { ...endpointForRequestedHttpMethod, pathVariables };
    }
}

export const router: Router = new Router();


