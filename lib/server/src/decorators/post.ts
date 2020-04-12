import { routesReadyState } from '../state';
import { RestSchema } from '../schema';

export function Post<T>( route: string, schema: RestSchema<T> = RestSchema.any() as RestSchema<T> ) {
    return ( target: any, methodName: string ) => {
        routesReadyState.incrementTargetNumberOfRoutes();
        routesReadyState.initializeRoute(Post,'POST', route, target, methodName, schema);
    }
}
