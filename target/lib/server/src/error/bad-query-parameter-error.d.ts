import { BadRequestError } from './bad-request-error';
export declare class BadQueryParameterError extends BadRequestError {
    constructor(requestedSchema: string);
}
