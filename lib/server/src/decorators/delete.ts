import { RestMapping } from './rest-mapping';

export function Delete( route: string ) {
    return RestMapping(Delete, route, 'DELETE');
}
