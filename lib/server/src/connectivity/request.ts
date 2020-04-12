import { IncomingHttpHeaders, IncomingMessage } from 'http';

import { RestSchema } from '../schema';
import { BadContentTypeError } from '../error';
import { Maybe, Parameters } from '../../../global-types';

export class Request<B, Q extends Parameters> {
    public static async serializeBody<T>( request: IncomingMessage, schema: RestSchema<T> ): Promise<T> {
        const rawBody: Buffer = await Request.binaryBody(request);
        const jsonBody = await Promise.resolve()
            .then(() => JSON.parse(rawBody.toString()))
            .catch(() => {
                throw new BadContentTypeError(rawBody.toString(), 'JSON');
            });
        return schema.serialize(jsonBody);
    }

    public static async binaryBody( request: IncomingMessage ): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            let body: any = [];
            request.on('error', (error: Error) => {
                reject(error);
            }).on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                resolve(Buffer.concat(body));
            }).on('close', () => {
                resolve(Buffer.concat(body));
            });
        });
    }

    public static async new<S, Q extends Parameters>( request: IncomingMessage, routeParameters: any, queryParameters: any,
        schema: Maybe<RestSchema<S>>, querySchema: Maybe<RestSchema<Q>>) : Promise<Request<Maybe<S>, Parameters | Q>> {
        const serializedQueryParams: Q | Parameters = querySchema?.serialize(queryParameters || {})
            || queryParameters;

        if ( schema === undefined ) {
            return new Request<undefined, {}>(request.headers, routeParameters, serializedQueryParams, undefined);
        }

        const serializedBody: S = await Request.serializeBody<S>(request, schema);
        return new Request<S, Q | Parameters>(request.headers, routeParameters, serializedQueryParams, serializedBody);
    }

    private constructor(
        public readonly headers: IncomingHttpHeaders,
        public readonly routeParams: any,
        public readonly queryParams: Q,
        public readonly body: B
    ) {}
}
