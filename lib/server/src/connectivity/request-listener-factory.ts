import { IncomingMessage, ServerResponse } from 'http';
import { Url, parse } from 'url';

import { Router } from '../routing/router';
import { Request } from './request';
import {
    getParameterIndexFromMetadata,
    getParameterSerializer,
    getRequestParameterIndexFromMethodMetaData,
    getQueryParameterSchemaFromMetadata, getBodySchemaFromMethodMetadata
} from '../decorators';
import { RestSchema } from '../schema';

export type RequestListener = ( request: IncomingMessage, response: ServerResponse ) => void;

export class RequestListenerFactory {

    constructor( private router: Router ) {}

    public create(): RequestListener {
        return ( request: IncomingMessage, response: ServerResponse ) => {
            const requestUrl: Url = parse(request.url || '', true);
            Promise.resolve()
                .then(() => this.router.routeRequest(request.method || '', requestUrl))
                .then(async mappedEndpoint => {
                    const resolvedRequest: Request<any, any> = await Request.new(
                        request,
                        mappedEndpoint.pathParameters,
                        requestUrl.query,
                        getBodySchemaFromMethodMetadata(mappedEndpoint.restMethod),
                        getQueryParameterSchemaFromMetadata(mappedEndpoint.restMethod)
                    );

                    // @RequestBody/@PathVariable/@QueryParameter
                    const callerArguments = createCallerArguments(mappedEndpoint.restMethod, resolvedRequest);
                    return mappedEndpoint.restMethod(callerArguments);
                })
                .then(restMethodReturnValue => {
                    // TODO Handle Response here
                    response.statusCode = 204;
                    response.end();
                }).catch(error => {
                    // TODO Inject error handler
                    console.log(error);
                    response.statusCode = 500;
                    response.end();
                });
        };
    }

}

function getDefaultStatusFrom( httpMethod: string, resultContent: any ): number {
    if ( resultContent === null || resultContent === undefined ) return 204;
    if ( httpMethod === 'GET' ) return 200;
    if ( httpMethod === 'POST' || httpMethod === 'PUT' || httpMethod === 'PATCH' ) return 201;
    return 204;
}

function createCallerArguments( restMethod: Function, request: Request<any, any> ): Array<any> {
    const args: Array<any> = [];

    const requestBodyIndex: number | undefined = getRequestParameterIndexFromMethodMetaData(restMethod);
    if ( requestBodyIndex !== undefined ) args[requestBodyIndex] = request.body;

    assignParametersToArguments(args, restMethod, request.routeParams, 'path:');
    assignParametersToArguments(args, restMethod, request.queryParams, 'query:');

    return args;
}

function assignParametersToArguments( args: Array<any>, method: Function, on: Object, type: 'path:' | 'query:' ): void {
    Object.entries(on)
        .map(entry => ({ key: entry[0], value: entry[1] }))
        .map(entry => ({
            ...entry,
            index: getParameterIndexFromMetadata(method, type + entry.key),
            serializer: getParameterSerializer(method, type + entry.key)
        }))
        .filter(entry => entry.index !== undefined)
        .forEach(entry => args[entry.index as number] = entry.serializer(entry.value));
}
