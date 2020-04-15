import { Qualifier } from '../../../global-types';
import { applicationContext } from '../../../injection/src/appplication-context';
import { copyMetadata, decoratedItemIsMethod } from '../decorators';
import { InvalidDecoratedItemError } from '../../../configuration/error';
import { ErrorHandler, errorHandlerRegistry } from '../error-handler';
import { PristineReadyStateEmitter } from './pristine-ready-state-emitter';

export class ErrorHandlerStateEmitter extends PristineReadyStateEmitter {
    private targetedNumberOfHandlers: number = 0;
    private initializedHandler: number = 0;

    public getSelfAndSetToReadyIfPristineAfterInit(): ErrorHandlerStateEmitter {
        applicationContext.whenLoaded(() => {
            if ( this.isPristine() ) {
                this.changeStateToReady();
            }
        });
        return this;
    }

    public initializeErrorHandler( target: any, methodName: Qualifier ): void {
        this.changeToStale();
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
