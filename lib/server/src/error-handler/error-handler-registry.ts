import { ErrorHandlerFunction } from './error-handler';

export class ErrorHandlerRegistry {
    private handlers: Array<ErrorHandlerFunction> = [];

    public addHandler( handler: ErrorHandlerFunction ): void {
        this.handlers.push(handler);
    }

    public retainAll(): Array<ErrorHandlerFunction> {
        return this.handlers;
    }
}

export const errorHandlerRegistry: ErrorHandlerRegistry = new ErrorHandlerRegistry();
