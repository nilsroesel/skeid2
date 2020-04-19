import { RestMapping } from './rest-mapping';

export function Put( route: string ) {
    return RestMapping(Put, route, 'PUT');
}
