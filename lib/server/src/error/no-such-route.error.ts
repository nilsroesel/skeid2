import { URL } from 'url';
import { ApiError } from './index';

export class NoSuchRouteError extends ApiError {
    constructor( url: URL ) {
        super(404, `Could not find a matching route to the requested url path: ${ url.pathname }`);
    }
}
