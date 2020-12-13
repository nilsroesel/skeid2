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
    ProducingMetadata,
    ResponseEntityInjectionMetadata,
    StatusCodeGenerator
} from '../decorators';
import { Response, ResponseFactory, ResponseEntityFactory } from './response';
import { Maybe } from '../../../global-types';
import {
    getEndpointMethodParameterIndexFromMethodMetaData,
    getEndpointScopeFromMethodMetaData, getSecurityConfigurationClass,
    Scope
} from '../../../security/src';
import { applicationContext } from '../../../injection/src/appplication-context';
import { NotAuthorizedError } from '../error/not-authorized-error';

export type RequestListener = ( request: IncomingMessage, response: ServerResponse ) => void;

export class RequestListenerFactory {

    constructor( private router: Router ) {}

    public create(): RequestListener {
        return ( request: IncomingMessage, response: ServerResponse ) => {
            const requestUrl: Url = parse(request.url || '', true);
            const responseEntityFactory: ResponseEntityFactory = new ResponseEntityFactory(response);
            // The request headers from IncomingMessage are always represented in lower case
            const contentTypeHeader = request.headers['content-type'];
            const requestContentType: Maybe<string> = Array.isArray(contentTypeHeader) ? contentTypeHeader[0] :
                contentTypeHeader;
            Promise.resolve()
                .then(() => this.router.routeRequest(request.method || '', requestUrl, requestContentType))
                .then(async mappedEndpoint => {
                    const securityConfigClass = getSecurityConfigurationClass();
                    if ( securityConfigClass === undefined ) return mappedEndpoint;

                    const resolvedRequest: Request<any, any> = await Request.new(
                        request,
                        mappedEndpoint.pathVariables,
                        requestUrl.query,
                        undefined,
                        undefined
                    );
                    // @RequestBody/@PathVariable/@QueryParameter/@Header/@EndpointMethod
                    // No Response
                    const callerArguments = createCallerArguments(
                        mappedEndpoint.restMethod,
                        resolvedRequest,
                        responseEntityFactory,
                        undefined,
                        getEndpointMethodParameterIndexFromMethodMetaData(mappedEndpoint.restMethod)
                    );

                    const definedScopeOfEndpoint: Scope = getEndpointScopeFromMethodMetaData(mappedEndpoint.restMethod);

                    await applicationContext.loadDependency(securityConfigClass)
                        .then(async securityConfig => {
                            const scopes: Array<string> = await securityConfig.resolveScopes(callerArguments);
                            if ( !definedScopeOfEndpoint.isValid(scopes) ) {
                                throw new NotAuthorizedError();
                            }
                        });

                    return mappedEndpoint;
                })
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

                    // @Response/@RequestBody/@PathVariable/@QueryParameter/@Header
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
                    const producingMetadata: ProducingMetadata = getProducingDecoratorMetadata(error.constructor);
                    const statusCodeGenerator = producingMetadata.statusCode || (() => 500);
                    responseEntity.status(statusCodeGenerator(error));
                    responseEntity.setHeader('Content-Type', mimeType);
                    responseEntity.body(error);
                    responseEntity.respond();
                });
        };
    }

}
type Index = number;
function createCallerArguments( restMethod: Function, request: Request<any, any>,
    responseEntityFactory: ResponseFactory,
    responseInjection: Maybe<ResponseEntityInjectionMetadata>,
    endpointMethodInjection?: Maybe<Index> ): Array<any> {
        const args: Array<any> = [];

        if ( responseInjection !== undefined ) {
            const selection = responseInjection.select(responseEntityFactory);
            args[responseInjection.index] = new (selection.apply(responseEntityFactory))();
        }

        if ( endpointMethodInjection !== undefined ) {

        }

        const requestBodyIndex: Maybe<number> = getRequestParameterIndexFromMethodMetaData(restMethod);
        if ( requestBodyIndex !== undefined ) args[requestBodyIndex] = request.body;

        assignParametersToArguments(args, restMethod, request.routeParams, 'path:');
        assignParametersToArguments(args, restMethod, request.queryParams, 'query:');
        assignParametersToArguments(args, restMethod, request.headers, 'header:')

        return args;
}

type ParameterItems = 'path:' | 'query:' | 'header:';

function assignParametersToArguments( args: Array<any>, method: Function, on: Object, type: ParameterItems ): void {
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

function resolveStatus( restMethod: Function, httpMethod: Maybe<string>, resultContent: any ): number {
    const generator: Maybe<StatusCodeGenerator<any>> = getProducingDecoratorMetadata(restMethod).statusCode;
    if ( generator !== undefined ) return generator(resultContent);

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
