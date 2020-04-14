import { routesReadyState } from '../state';

export function Put( route: string ) {
    return ( target: any, methodName: string ) => {
        routesReadyState.incrementTargetNumberOfRoutes();
        routesReadyState.initializeRoute(Put,'PUT', route, target, methodName);
    }
}
