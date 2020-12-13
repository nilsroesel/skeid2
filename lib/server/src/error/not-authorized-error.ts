import { ApiError } from './index';

export class NotAuthorizedError extends ApiError {
    constructor() {
        super(401, 'Request is not authorized to perform the requested action.');
    }
}
