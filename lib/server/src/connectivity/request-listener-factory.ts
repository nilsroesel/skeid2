import { IncomingMessage, ServerResponse } from 'http';
import { parse, Url } from 'url';

import { Router } from '../routing/router';
import { Request } from './request';
import {
    getBodySchemaFromMethodMetadata,
    getParameterIndexFromMetadata,
    getParameterSerializer,
    getProducingDecoratorMetadata,
    getQueryParameterSchemaFromMetadata,
    getRequestParameterIndexFromMethodMetaData,
    getResponseEntityInjectionMetadata,
    ProducingMetadata,
    ResponseEntityInjectionMetadata
} from '../decorators';
import { Response, ResponseFactory, ResponseEntityFactory } from './response';
import { Maybe } from '../../../global-types';
import { RestErrorHandler } from '../error-handler';

export type RequestListener = ( request: IncomingMessage, response: ServerResponse ) => void;

export class RequestListenerFactory {

    constructor( private router: Router, private errorHandler: RestErrorHandler ) {}

    public create(): RequestListener {
        return ( request: IncomingMessage, response: ServerResponse ) => {
            const requestUrl: Url = parse(request.url || '', true);
            Promise.resolve()
                .then(() => this.router.routeRequest(request.method || '', requestUrl))
                .then(async mappedEndpoint => {
                    const defaultEssentialResponseOptions: ProducingMetadata =
                        getProducingDecoratorMetadata(mappedEndpoint.restMethod);

                    const responseInjection: Maybe<ResponseEntityInjectionMetadata> =
                        getResponseEntityInjectionMetadata(mappedEndpoint.restMethod);

                    const usedMimeType = defaultEssentialResponseOptions.mimeType || 'application/json';
                    const resolvedRequest: Request<any, any> = await Request.new(
                        request,
                        mappedEndpoint.pathParameters,
                        requestUrl.query,
                        getBodySchemaFromMethodMetadata(mappedEndpoint.restMethod),
                        getQueryParameterSchemaFromMetadata(mappedEndpoint.restMethod)
                    );
                    const responseEntityFactory: ResponseEntityFactory = new ResponseEntityFactory(response);

                    const responseEntity = constructResponseBasedOnMimeType(usedMimeType, responseEntityFactory);

                    // @RequestBody/@PathVariable/@QueryParameter/@ResponseEntity
                    const callerArguments = createCallerArguments(
                        mappedEndpoint.restMethod,
                        resolvedRequest,
                        responseEntityFactory,
                        responseInjection
                    );
                    const result = await mappedEndpoint.restMethod(callerArguments);

                    if ( responseInjection === undefined ) {
                        const statusCode = defaultEssentialResponseOptions.statusCode
                            || getDefaultStatusFrom(request.method, result);
                        responseEntity.status(statusCode);
                        responseEntity.setHeader('Content-Type', usedMimeType);
                        responseEntity.body(result);
                        return responseEntity;
                    }
                    return;
                })
                .then((responseEntity: Maybe<Response>) => {
                    responseEntity?.respond();
                }).catch(error => {
                    const apiError = this.errorHandler.handleError(error);
                    response.statusCode = apiError.code;
                    response.end();
                });
        };
    }

}

function getDefaultStatusFrom( httpMethod: Maybe<string>, resultContent: any ): number {
    if ( resultContent === null || resultContent === undefined ) return 204;
    if ( httpMethod === 'GET' ) return 200;
    if ( httpMethod === 'POST' || httpMethod === 'PUT' || httpMethod === 'PATCH' ) return 201;
    return 204;
}

function createCallerArguments( restMethod: Function, request: Request<any, any>,
    responseEntityFactory: ResponseFactory,
    responseInjection: Maybe<ResponseEntityInjectionMetadata> ): Array<any> {
        const args: Array<any> = [];

        if ( responseInjection !== undefined ) {
            const selection = responseInjection.select(responseEntityFactory);
            args[responseInjection.index] = new (selection.apply(responseEntityFactory))();
        }

        const requestBodyIndex: Maybe<number> = getRequestParameterIndexFromMethodMetaData(restMethod);
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

function constructResponseBasedOnMimeType( mimeType: string, factory: ResponseEntityFactory ): Response {
    if ( mimeType === 'application/json' ) return new (factory.JsonResponseEntity())();

    if ( mimeType.startsWith('text/') ) return new (factory.TextResponseEntity())();

    return new (factory.ResponseEntity())();

}
