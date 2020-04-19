import { RestMapping } from './rest-mapping';

export function Post( route: string ) {
    return RestMapping(Post, route, 'POST');
}
