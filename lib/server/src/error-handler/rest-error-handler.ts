import { ApiError } from '../error';
import { errorHandlerRegistry } from './error-handler-registry';
import { Maybe } from '../../../global-types';
import { ErrorHandlerFunction } from './error-handler';

export class RestErrorHandler {

    public static customOnly(): RestErrorHandler {
        return new RestErrorHandler();
    }

    public static useDefaultHandlerFunction( ...handlers: Array<ErrorHandlerFunction> ): RestErrorHandler {
        return new RestErrorHandler(handlers);
    }

    private constructor( private readonly defaultHandlers: Array<ErrorHandlerFunction> = [] ) {}

    public handleError( error: Error ): ApiError {
        const customHandlerResult: Maybe<ApiError> = errorHandlerRegistry.retainAll()
            .map(handler => handler(error)).filter(result => result instanceof ApiError)[0];

        return customHandlerResult || new ApiError(500,
            `${ error.name }: ${ error.message } \n ${ error.stack || '' }`);
    }

}
