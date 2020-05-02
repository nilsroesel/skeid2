/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { Router } from '../routing/router';
export declare type RequestListener = (request: IncomingMessage, response: ServerResponse) => void;
export declare class RequestListenerFactory {
    private router;
    constructor(router: Router);
    create(): RequestListener;
}
