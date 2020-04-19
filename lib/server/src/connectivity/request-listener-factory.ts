import { IncomingMessage, ServerResponse } from 'http';
import { parse, Url } from 'url';

import { Router } from '../routing/router';
import { Request } from './request';
import {
    getBodySchemaFromMethodMetadata,
    getDeserializerMetadata,
    getParameterIndexFromMetadata,
    getParameterSerializer,
    getProducingDecoratorMetadata,
    getQueryParameterSchemaFromMetadata,
    getRequestParameterIndexFromMethodMetaData,
    getResponseEntityInjectionMetadata,
    ResponseEntityInjectionMetadata
} from '../decorators';
import { Response, ResponseFactory, ResponseEntityFactory } from './response';
import { Maybe } from '../../../global-types';

export type RequestListener = ( request: IncomingMessage, response: ServerResponse ) => void;

export class RequestListenerFactory {

    constructor( private router: Router ) {}

    public create(): RequestListener {
        return ( request: IncomingMessage, response: ServerResponse ) => {
            const requestUrl: Url = parse(request.url || '', true);
            const responseEntityFactory: ResponseEntityFactory = new ResponseEntityFactory(response);
            Promise.resolve()
                .then(() => this.router.routeRequest(request.method || '', requestUrl))
                .then(async mappedEndpoint => {
                    const responseInjection: Maybe<ResponseEntityInjectionMetadata> =
                        getResponseEntityInjectionMetadata(mappedEndpoint.restMethod);

                    const resolvedRequest: Request<any, any> = await Request.new(
                        request,
                        mappedEndpoint.pathVariables,
                        requestUrl.query,
                        getBodySchemaFromMethodMetadata(mappedEndpoint.restMethod),
                        getQueryParameterSchemaFromMetadata(mappedEndpoint.restMethod)
                    );

                    // @RequestBody/@PathVariable/@QueryParameter
                    const callerArguments = createCallerArguments(
                        mappedEndpoint.restMethod,
                        resolvedRequest,
                        responseEntityFactory,
                        responseInjection
                    );
                    const result = await mappedEndpoint.restMethod(callerArguments);

                    const mimeType: string = resolveMimeType(mappedEndpoint.restMethod, result);
                    const responseEntity: Response = constructResponseBasedOnMimeType(mimeType, responseEntityFactory);
                    if ( responseInjection === undefined ) {
                        const statusCode = resolveStatus(mappedEndpoint.restMethod, request.method, result);
                        responseEntity.status(statusCode);
                        responseEntity.setHeader('Content-Type', mimeType);
                        responseEntity.body(result);
                        return responseEntity;
                    }
                    return;
                })
                .then((responseEntity: Maybe<Response>) => responseEntity?.respond())
                .catch(error => {
                    // TODO Inject error handler
                    console.log(error);
                    const mimeType: string = resolveMimeType(error.constructor, error);
                    const responseEntity: Response = constructResponseBasedOnMimeType(mimeType, responseEntityFactory);
                    responseEntity.status(getProducingDecoratorMetadata(error.constructor).statusCode || 500);
                    responseEntity.setHeader('Content-Type', mimeType);
                    responseEntity.body(error);
                    responseEntity.respond();
                });
        };
    }

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
    console.log(1)

    return new (factory.ResponseEntity())();
}

function resolveStatus( restMethod: Function, httpMethod: Maybe<string>, resultContent: any ): number {
    const producingStatusCode: Maybe<number> = getProducingDecoratorMetadata(restMethod).statusCode;
    if ( producingStatusCode !== undefined ) return producingStatusCode;

    if ( resultContent === null || resultContent === undefined ) return 204;
    if ( httpMethod === 'GET' ) return 200;
    if ( httpMethod === 'POST' || httpMethod === 'PUT' || httpMethod === 'PATCH' ) return 201;
    return 204;
}


function resolveMimeType( restMethod: Function, restMethodResult: any ): string {
    let mimeType: string = 'text/plain';

    mimeType = getProducingDecoratorMetadata(restMethod).mimeType || mimeType;
    if ( restMethodResult?.constructor !== undefined ) {
        mimeType = getDeserializerMetadata(restMethodResult.constructor).mimeType || mimeType;
    }

    return mimeType;
}
