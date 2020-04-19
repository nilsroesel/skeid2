import { RestMapping } from './rest-mapping';

export function Get( route: string ) {
    return RestMapping(Get, route, 'GET');
}
