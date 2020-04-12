import { applicationContext } from '../../../injection/src/appplication-context';
import { decoratedItemIsMethod } from '../decorators';
import { InvalidDecoratedItemError } from '../../../configuration';
import { router } from '../routing/router';
import { ReadyStateEmitter } from './ready-state-emitter';
import { RestSchema } from '../schema';

class RoutesReadyStateEmitter extends ReadyStateEmitter {

    private targetNumberOfRoutes: number = 0;
    private initializedRoutes: number = 0;

    public incrementTargetNumberOfRoutes(): void {
        ++this.targetNumberOfRoutes;
    }

    public incrementInitializedRoutes(): void {
        ++this.initializedRoutes;
        if ( this.initializedRoutes === this.targetNumberOfRoutes ) {
            this.changeStateToReady();
        }
    }

    public initializeRoute<T>( decorator: Function, httpMethod: string, route: string, target: any,
        methodName: string, schema?: RestSchema<T> | undefined ): void {
        // This will change effectively the evaluation order of the typescript decorators.
        // To ensure decorators, on which this decorator relies on, are evaluated
        applicationContext.whenLoaded(() => {
            applicationContext.loadDependency(target.constructor).then(( component: any ) => {
                const method: unknown = component[methodName];
                if ( !decoratedItemIsMethod(method) ) {
                    throw new InvalidDecoratedItemError(decorator, ['METHOD']);
                }
                this.incrementInitializedRoutes();
                router.registerRoute(httpMethod, route, () => method.apply(component), schema);
            })
        });
    }
}

export const routesReadyState: RoutesReadyStateEmitter = new RoutesReadyStateEmitter();
