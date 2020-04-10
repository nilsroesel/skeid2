import { ApiError } from './api.error';

export class BadRequestError extends ApiError {
    constructor( message: string = 'Bad Request' ) {
        super(400, message);
    }
}
