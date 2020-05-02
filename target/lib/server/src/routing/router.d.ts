/// <reference types="node" />
import { Url } from 'url';
import { AssignedPathVariables, RegisteredEndpoint } from './';
import { Maybe } from '../../../global-types';
export declare class Router {
    private readonly routes;
    constructor();
    registerRoute<T>(httpMethod: string, route: string, restMethod: Function): void;
    routeRequest(httpMethod: string, url: Url, contentType?: Maybe<string>): RegisteredEndpoint<unknown> & AssignedPathVariables;
}
export declare const router: Router;
