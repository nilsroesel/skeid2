import { ClashingRoutesError, DuplicatedEndpointError } from '../../../configuration/error';
import { RoutePart, RegisteredEndpoint } from './';

export class RouteCollection {
    public static initializeNew(): RouteCollection {
        return new RouteCollection(RoutePart.constructFromString(''));
    }

    private readonly subRoutes: Array<RouteCollection> = new Array<RouteCollection>();

    private endpoints: Array<RegisteredEndpoint> = new Array<RegisteredEndpoint>();

    private constructor(
        private readonly route: RoutePart,
        private readonly fullQualifiedRoute: Array<string> = [route.getPart()]
    ) {}

    public addSubRoute( subRoute: Array<string>, endpoint: RegisteredEndpoint ): void | never {
        // TODO throw if subRoutes contains undefined/null
        if ( subRoute.length === 0 ) return;
        const currentPart: RoutePart = RoutePart.constructFromString(subRoute[0]);
        if ( currentPart.getPart() === this.route.getPart() ) {
            this.addSubRoute(subRoute.slice(1), endpoint);
            return;
        }

        const newChild: RouteCollection = this.addChild(currentPart);
        if ( subRoute.length === 1 ) {
            if ( newChild.endpointForHttpMethodAlreadyExists(endpoint.httpMethod) ) {
                throw new DuplicatedEndpointError(newChild.fullQualifiedRoute, endpoint.httpMethod);
            }
            newChild.endpoints.push({ ...endpoint, route: newChild.fullQualifiedRoute });
        }
        newChild.addSubRoute(subRoute.slice(1), endpoint);
    }

    public findEndpointsByRoute( route: Array<string> ): Array<RegisteredEndpoint> {
        if ( route.length === 0 ) return [];
        if ( route.length === 1 ) return this.endpoints;

        if ( this.route.matchesSplitedUrlPart(route[0]) ) {
            const nextPart: RoutePart = RoutePart.constructFromString(route[1]);
            const childWithExactString: RouteCollection | undefined = this.getChild(nextPart);
            const childAsPathVariable: RouteCollection | undefined = this.getPathVariable();

            return childWithExactString?.findEndpointsByRoute(route.slice(1)) ||
                childAsPathVariable?.findEndpointsByRoute(route.slice(1)) || []
        }
        return [];
    }

    private addChild( routePart: RoutePart ): RouteCollection {
        const existingRoutePart: RouteCollection | undefined = this.getChild(routePart);
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

    private getChild( routePart: RoutePart ): RouteCollection | undefined {
        return this.subRoutes.find(part => part.route.getPart() === routePart.getPart());
    }

    private getPathVariable(): RouteCollection | undefined {
        return this.subRoutes.find(part => part.route.isPathVariable());
    }

    private hasAlreadyPathVariableAsChild(): boolean {
        return this.subRoutes.find(part => part.route.isPathVariable()) !== undefined;
    }

    private endpointForHttpMethodAlreadyExists( httpMethod: string ): boolean {
        return this.endpoints.find(e => e.httpMethod === httpMethod) !== undefined;
    }
}

