import { ReadyStateEmitter } from './ready-state-emitter';
import { Qualifier } from '../../../global-types';
import { applicationContext } from '../../../injection/src/appplication-context';
import { copyMetadata, decoratedItemIsMethod } from '../decorators';
import { InvalidDecoratedItemError } from '../../../configuration/error';
import { ErrorHandler, errorHandlerRegistry } from '../error-handler';

export class ErrorHandlerStateEmitter extends ReadyStateEmitter {
    private targetedNumberOfHandlers: number = 0;
    private initializedHandler: number = 0;

    public changeToReadyAfterApplicationInitWithEmptyRegistry(): ReadyStateEmitter {
        applicationContext.whenLoaded(() => {
            if ( this.targetedNumberOfHandlers === 0 ) {
                this.changeStateToReady();
            }
        });
        return this;
    }

    public initializeErrorHandler( target: any, methodName: Qualifier ): void {
        ++this.targetedNumberOfHandlers;
        applicationContext.whenLoaded(async () => {
            this.incrementInitialized();
            const handlerComponent: any = await applicationContext.loadDependency(target.constructor);
            const method: unknown = handlerComponent[methodName];
            if ( !decoratedItemIsMethod(method) ) {
                throw new InvalidDecoratedItemError(ErrorHandler, ['METHOD']);
            }
            const handler = (error: any) => method.apply(handlerComponent, [error]);
            copyMetadata(method, handler);
            errorHandlerRegistry.addHandler(handler);
        });
    }

    private incrementInitialized() {
        ++this.initializedHandler;
        if ( this.targetedNumberOfHandlers === this.initializedHandler ) {
            this.changeStateToReady();
        }
    }
}

export const errorHandlerReadyState: ErrorHandlerStateEmitter = new ErrorHandlerStateEmitter();
