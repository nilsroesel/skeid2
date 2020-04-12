import { Url } from 'url';
import { ApiError } from './index';

export class NoSuchRouteError extends ApiError {
    constructor( url: Url ) {
        super(404, `Could not find a matching route to the requested url path: ${ url.pathname }`);
    }
}
