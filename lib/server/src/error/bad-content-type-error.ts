import { BadRequestError } from './bad-request-error';

export class BadContentTypeError extends BadRequestError {
    constructor( content: string, expectedType: string ) {
        super(`<<${ content }>> is no valid ${ expectedType }-Data `);
    }
}
