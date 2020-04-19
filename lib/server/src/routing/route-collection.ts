import { ClashingRoutesError, DuplicatedEndpointError } from '../../../configuration/error';
import { RegisteredEndpoint, RoutePart } from './';
import { Maybe } from '../../../global-types';
import { getConsumingMimeType } from '../decorators/consumes';

export class RouteCollection {

    public static initializeNew(): RouteCollection {
        return new RouteCollection(RoutePart.constructFromString(''));
    }

    public static parsePathParameters( route: Array<string>, urlPath: Array<string> ): { [parameter: string]: any } {
        const pathParameters = {};

        route.map(RoutePart.constructFromString)
            .map((part, index) => ({ part, index }))
            .filter(i => i.part.isPathVariable())
            .forEach(pathVariableWithIndex => {
                const parameterName: string = pathVariableWithIndex.part.getName();
                const parameterValue: string = urlPath[pathVariableWithIndex.index];
                Object.assign(pathParameters, { [parameterName]: parameterValue });
            });
        return pathParameters;
    }

    private readonly subRoutes: Array<RouteCollection> = new Array<RouteCollection>();

    private endpoints: Array<RegisteredEndpoint<any>> = new Array<RegisteredEndpoint<any>>();

    private constructor(
        private readonly route: RoutePart,
        private readonly fullQualifiedRoute: Array<string> = [route.getPart()]
    ) {}

    public addSubRoute<T>( subRoute: Array<string>, endpoint: RegisteredEndpoint<T> ): void | never {
        // TODO throw if subRoutes contains undefined/null
        if ( subRoute.length === 0 ) return;
        const currentPart: RoutePart = RoutePart.constructFromString(subRoute[0]);
        if ( currentPart.getPart() === this.route.getPart() ) {
            this.addSubRoute(subRoute.slice(1), endpoint);
            return;
        }

        const newChild: RouteCollection = this.addChild(currentPart);
        if ( subRoute.length === 1 ) {
            if ( newChild.endpointExistsWithMimeTypeAndHttpMethod(endpoint.httpMethod, endpoint.restMethod) ) {
                throw new DuplicatedEndpointError(newChild.fullQualifiedRoute, endpoint.httpMethod);
            }
            newChild.endpoints.push({ ...endpoint, route: newChild.fullQualifiedRoute });
        }
        newChild.addSubRoute(subRoute.slice(1), endpoint);
    }

    public findEndpointsByRoute( route: Array<string> ): Array<RegisteredEndpoint<any>> {
        if ( route.length === 0 ) return [];
        if ( route.length === 1 ) return this.endpoints;

        if ( this.route.matchesSplitedUrlPart(route[0]) ) {
            const nextPart: RoutePart = RoutePart.constructFromString(route[1]);
            const childWithExactString: Maybe<RouteCollection> = this.getChild(nextPart);
            const childAsPathVariable: Maybe<RouteCollection> = this.getPathVariable();

            return childWithExactString?.findEndpointsByRoute(route.slice(1)) ||
                childAsPathVariable?.findEndpointsByRoute(route.slice(1)) || []
        }
        return [];
    }

    private addChild( routePart: RoutePart ): RouteCollection {
        const existingRoutePart: Maybe<RouteCollection> = this.getChild(routePart);
        if ( existingRoutePart !== undefined ) {
            return existingRoutePart;
        }

        if ( routePart.isPathVariable() && this.hasAlreadyPathVariableAsChild() ) {
            throw new ClashingRoutesError(this.fullQualifiedRoute.concat(routePart.getPart()),
                this.getPathVariable()?.fullQualifiedRoute || []);
        }

        const newSubRoute: RouteCollection =
            new RouteCollection(routePart, this.fullQualifiedRoute.concat(routePart.getPart()));
        this.subRoutes.push(newSubRoute);
        return newSubRoute;
    }

    private getChild( routePart: RoutePart ): Maybe<RouteCollection> {
        return this.subRoutes.find(part => part.route.getPart() === routePart.getPart());
    }

    private getPathVariable(): Maybe<RouteCollection> {
        return this.subRoutes.find(part => part.route.isPathVariable());
    }

    private hasAlreadyPathVariableAsChild(): boolean {
        return this.subRoutes.find(part => part.route.isPathVariable()) !== undefined;
    }

    private endpointExistsWithMimeTypeAndHttpMethod( httpMethod: string, restMethod: Function ): boolean {
        return this.endpoints
            .filter(e => e.httpMethod === httpMethod)
            .map(e => e.restMethod)
            .find(fn => getConsumingMimeType(fn) === getConsumingMimeType(restMethod)) !== undefined;
    }
}

