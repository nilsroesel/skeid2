import { RegisteredEndpoint } from './';
export declare class RouteCollection {
    private readonly route;
    private readonly fullQualifiedRoute;
    static initializeNew(): RouteCollection;
    static parsePathParameters(route: Array<string>, urlPath: Array<string>): {
        [parameter: string]: any;
    };
    private readonly subRoutes;
    private endpoints;
    private constructor();
    addSubRoute<T>(subRoute: Array<string>, endpoint: RegisteredEndpoint<T>): void | never;
    findEndpointsByRoute(route: Array<string>): Array<RegisteredEndpoint<any>>;
    private addChild;
    private getChild;
    private getPathVariable;
    private hasAlreadyPathVariableAsChild;
    private endpointExistsWithMimeTypeAndHttpMethod;
}
