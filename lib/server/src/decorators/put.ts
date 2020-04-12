import { routesReadyState } from '../state';
import { RestSchema } from '../schema';

export function Put<T>( route: string, schema: RestSchema<T> = RestSchema.any() as RestSchema<T> ) {
    return ( target: any, methodName: string ) => {
        routesReadyState.incrementTargetNumberOfRoutes();
        routesReadyState.initializeRoute(Put,'PUT', route, target, methodName, schema);
    }
}
