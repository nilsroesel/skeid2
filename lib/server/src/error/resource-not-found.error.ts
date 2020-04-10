import { ApiError } from './api.error';

export class ResourceNotFoundError extends ApiError {
    constructor( resource: any ) {
        super(404, `Resource ${ resource } not found`);
    }
}
