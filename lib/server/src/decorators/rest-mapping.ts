import { routesReadyState } from '../state';

export function RestMapping( decoratorFunction: Function, route: string, httpMethod: string ) {
    return ( target: any, methodName: string ) => {
        routesReadyState.incrementTargetNumberOfRoutes();
        routesReadyState.initializeRoute(decoratorFunction, httpMethod, route, target, methodName);
    }
}
