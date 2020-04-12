import { routesReadyState } from '../state';

export function Get( route: string ) {
    return ( target: any, methodName: string ) => {
        routesReadyState.incrementTargetNumberOfRoutes();
        routesReadyState.initializeRoute(Get,'GET', route, target, methodName, undefined);
    }
}
