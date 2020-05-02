import { BadRequestError } from './bad-request-error';
export declare class BadContentTypeError extends BadRequestError {
    constructor(content: string, expectedType: string);
}
