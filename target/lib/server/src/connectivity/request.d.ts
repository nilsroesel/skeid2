/// <reference types="node" />
import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { RestSchema } from '../schema';
import { Maybe, Parameters } from '../../../global-types';
export declare class Request<B, Q extends Parameters> {
    readonly headers: IncomingHttpHeaders;
    readonly routeParams: any;
    readonly queryParams: Q;
    readonly body: B;
    static serializeBody<T>(request: IncomingMessage, schema: RestSchema<T>): Promise<T>;
    static binaryBody(request: IncomingMessage): Promise<Buffer>;
    static new<S, Q extends Parameters>(request: IncomingMessage, routeParameters: any, queryParameters: any, schema: Maybe<RestSchema<S>>, querySchema: Maybe<RestSchema<Q>>): Promise<Request<Maybe<S>, Parameters | Q>>;
    private constructor();
}
