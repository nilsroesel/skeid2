import { routesReadyState } from '../state';

export function Post( route: string ) {
    return ( target: any, methodName: string ) => {
        routesReadyState.incrementTargetNumberOfRoutes();
        routesReadyState.initializeRoute(Post,'POST', route, target, methodName);
    }
}
