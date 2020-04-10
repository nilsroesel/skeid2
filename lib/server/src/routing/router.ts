import { URL } from 'url';
import { MethodNotAllowedError, NoSuchRouteError } from '../error';
import { RegisteredEndpoint, RouteCollection } from './';

export class Router {

    private readonly routes: RouteCollection = RouteCollection.initializeNew();

    constructor() {}

    public registerRoute( httpMethod: string, route: string, restMethod: Function ) {
        const routeParts: Array<string> = route.split('/');
        const endpoint: RegisteredEndpoint = { httpMethod, restMethod };

        this.routes.addSubRoute(routeParts, endpoint);
    }

    routeRequest( httpMethod: string, url: URL ): Function | never {
        const calledRoute: Array<string> = url.pathname.split('/');

        const endpointsWithMatchingRoute: Array<RegisteredEndpoint> = this.routes.findEndpointsByRoute(calledRoute);

        if ( endpointsWithMatchingRoute.length === 0 ) {
            throw new NoSuchRouteError(url);
        }

        const endpointForRequestedHttpMethod: RegisteredEndpoint | undefined = endpointsWithMatchingRoute
            .find(endpoint => endpoint.httpMethod === httpMethod);

        if ( endpointForRequestedHttpMethod === undefined ) {
            throw new MethodNotAllowedError(httpMethod, endpointsWithMatchingRoute[0].route?.join('/'))
        }

        return endpointForRequestedHttpMethod.restMethod;
    }
}

export const router: Router = new Router();


