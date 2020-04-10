import { ApiError } from './api.error';

export class MethodNotAllowedError extends ApiError {
    constructor( method: string, path: string = '' ) {
        super(405, `Method: ${ method.toUpperCase() } is not allowed on the specified path ${ path }`);
    }
}
