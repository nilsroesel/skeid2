import { applicationContext } from '../../../injection/src/appplication-context';
import { copyMetadata, decoratedItemIsMethod } from '../decorators';
import { InvalidDecoratedItemError } from '../../../configuration';
import { router } from '../routing/router';
import { ReadyStateEmitter } from './ready-state-emitter';

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
        methodName: string ): void {
        // This will change effectively the evaluation order of the typescript decorators.
        // To ensure decorators, on which this decorator relies on, are evaluated
        applicationContext.whenLoaded(async () => {
            const component: any = await applicationContext.loadDependency(target.constructor);

            const method: unknown = component[methodName];
            if ( !decoratedItemIsMethod(method) ) {
                throw new InvalidDecoratedItemError(decorator, ['METHOD']);
            }
            const restMethod = ( args: Array<any> ) => method.apply(component, args);
            copyMetadata(method, restMethod);
            this.incrementInitializedRoutes();
            router.registerRoute(httpMethod, route, restMethod);
        });
    }
}

export const routesReadyState: RoutesReadyStateEmitter = new RoutesReadyStateEmitter();
