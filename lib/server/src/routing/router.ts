import { Url } from 'url';
import { MethodNotAllowedError, NoSuchRouteError } from '../error';
import { AssignedPathParameters, RegisteredEndpoint, RouteCollection } from './';
import { RestSchema } from '../schema';

export class Router {

    private readonly routes: RouteCollection = RouteCollection.initializeNew();

    constructor() {}

    public registerRoute<T>( httpMethod: string, route: string, restMethod: Function,
        schema?: RestSchema<T> | undefined ) {
            const routeParts: Array<string> = route.split('/');
            const endpoint: RegisteredEndpoint<T> = { httpMethod, restMethod, schema };

            this.routes.addSubRoute(routeParts, endpoint);
    }

    routeRequest( httpMethod: string, url: Url ): RegisteredEndpoint<unknown> & AssignedPathParameters {
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

        const pathParameters = RouteCollection.parsePathParameters(endpointForRequestedHttpMethod.route || [],
            calledRoute);

        return { ...endpointForRequestedHttpMethod, pathParameters };
    }
}

export const router: Router = new Router();


