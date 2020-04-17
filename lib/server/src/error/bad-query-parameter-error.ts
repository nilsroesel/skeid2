import { BadRequestError } from './bad-request-error';

export class BadQueryParameterError extends BadRequestError {
    constructor( requestedSchema: string ) {
        super(`The passed query parameters do not fit to the requested schema: ${ requestedSchema }`);
    }
}
