import { RestMapping } from './rest-mapping';

export function Patch( route: string ) {
    return RestMapping(Patch, route, 'PATCH');
}
