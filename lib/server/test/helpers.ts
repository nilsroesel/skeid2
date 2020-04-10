import { URL } from 'url';

export function mockUrl( path: string ): URL {
    return new URL('http://www.foo.de' + path);
}
