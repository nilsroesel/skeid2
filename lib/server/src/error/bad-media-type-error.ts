import { ApiError } from './api.error';

export class BadMediaTypeError extends ApiError {
    constructor( operationPath: string, accepted: Array<string> = [] ) {
        super(415, `Unsupported media type for operation ${ operationPath }. Acceptable: ${ accepted.join(';') }`);
    }
}
