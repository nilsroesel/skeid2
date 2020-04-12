import { routesReadyState } from '../state';

export function Delete( route: string ) {
    return ( target: any, methodName: string ) => {
        routesReadyState.incrementTargetNumberOfRoutes();
        routesReadyState.initializeRoute(Delete,'DELETE', route, target, methodName, undefined);
    }
}
