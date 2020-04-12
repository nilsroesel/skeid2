import { routesReadyState } from '../state';

export function Post( route: string ) {
    return ( target: any, methodName: string ) => {
        routesReadyState.incrementTargetNumberOfRoutes();
        routesReadyState.initializeRoute('POST', route, target, methodName);
    }
}
