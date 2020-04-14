import { routesReadyState } from '../state';

export function Patch( route: string ) {
    return ( target: any, methodName: string ) => {
        routesReadyState.incrementTargetNumberOfRoutes();
        routesReadyState.initializeRoute(Patch,'PATCH', route, target, methodName);
    }
}
