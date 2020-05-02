/// <reference types="node" />
import { URL } from 'url';
export declare function mockUrl(path: string): URL;
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
