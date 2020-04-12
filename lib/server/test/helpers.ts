import { URL } from 'url';

export function mockUrl( path: string ): URL {
    return new URL('http://www.foo.de' + path);
}

export interface Address {
    street: string;
    zipCode: string;
}

export interface User {
    id: number;
    name: string;
    createdDate?: Date;
}

export interface UserWithAddress extends User {
    address: Address;
}

export interface UserList {
    users: Array<User>;
}
