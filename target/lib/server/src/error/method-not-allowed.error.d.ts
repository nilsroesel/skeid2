import { ApiError } from './api.error';
export declare class MethodNotAllowedError extends ApiError {
    constructor(method: string, path?: string);
}
