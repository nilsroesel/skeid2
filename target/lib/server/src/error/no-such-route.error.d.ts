/// <reference types="node" />
import { Url } from 'url';
import { ApiError } from './index';
export declare class NoSuchRouteError extends ApiError {
    constructor(url: Url);
}
