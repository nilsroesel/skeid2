import { ApiError } from './api.error';

export class BadMediaTypeError extends ApiError {
    constructor( operation: Function, accepted: Array<string> = [] ) {
        super(416, `Unsupported media type for operation ${ operation.name }. Acceptable: ${ accepted.join(';') }`);
    }
}
