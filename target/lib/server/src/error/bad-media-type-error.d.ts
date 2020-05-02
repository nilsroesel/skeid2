import { ApiError } from './api.error';
export declare class BadMediaTypeError extends ApiError {
    constructor(operationPath: string, accepted?: Array<string>);
}
