import { ApiError } from '../error';
import { Qualifier } from '../../../global-types';
import { decoratedItemIsMethod } from '../decorators';
import { InvalidDecoratedItemError } from '../../../configuration/error';
import { errorHandlerReadyState } from '../state';

export type ErrorHandlerFunction = ( error: Error ) => ApiError;

export function ErrorHandler( target: any, methodName: Qualifier ) {
    if ( !decoratedItemIsMethod(target[methodName]) ) {
        throw new InvalidDecoratedItemError(ErrorHandler, ['METHOD']);
    }
    errorHandlerReadyState.initializeErrorHandler(target, methodName);
}
