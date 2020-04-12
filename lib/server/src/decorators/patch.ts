import { routesReadyState } from '../state';
import { RestSchema } from '../schema';

export function Patch<T>( route: string, schema: RestSchema<T> = RestSchema.any() as RestSchema<T> ) {
    return ( target: any, methodName: string ) => {
        routesReadyState.incrementTargetNumberOfRoutes();
        routesReadyState.initializeRoute(Patch,'PATCH', route, target, methodName, schema);
    }
}
