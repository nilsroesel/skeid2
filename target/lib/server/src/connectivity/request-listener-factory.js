"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const request_1 = require("./request");
const decorators_1 = require("../decorators");
const response_1 = require("./response");
class RequestListenerFactory {
    constructor(router) {
        this.router = router;
    }
    create() {
        return (request, response) => {
            const requestUrl = url_1.parse(request.url || '', true);
            const responseEntityFactory = new response_1.ResponseEntityFactory(response);
            // The request headers from IncomingMessage are always represented in lower case
            const contentTypeHeader = request.headers['content-type'];
            const requestContentType = Array.isArray(contentTypeHeader) ? contentTypeHeader[0] :
                contentTypeHeader;
            Promise.resolve()
                .then(() => this.router.routeRequest(request.method || '', requestUrl, requestContentType))
                .then((mappedEndpoint) => __awaiter(this, void 0, void 0, function* () {
                const responseInjection = decorators_1.getResponseEntityInjectionMetadata(mappedEndpoint.restMethod);
                const resolvedRequest = yield request_1.Request.new(request, mappedEndpoint.pathVariables, requestUrl.query, decorators_1.getBodySchemaFromMethodMetadata(mappedEndpoint.restMethod), decorators_1.getQueryParameterSchemaFromMetadata(mappedEndpoint.restMethod));
                // @RequestBody/@PathVariable/@QueryParameter
                const callerArguments = createCallerArguments(mappedEndpoint.restMethod, resolvedRequest, responseEntityFactory, responseInjection);
                const result = yield mappedEndpoint.restMethod(callerArguments);
                const mimeType = resolveMimeType(mappedEndpoint.restMethod, result);
                const responseEntity = constructResponseBasedOnMimeType(mimeType, responseEntityFactory);
                if (responseInjection === undefined) {
                    const statusCode = resolveStatus(mappedEndpoint.restMethod, request.method, result);
                    responseEntity.status(statusCode);
                    responseEntity.setHeader('Content-Type', mimeType);
                    responseEntity.body(result);
                    return responseEntity;
                }
                return;
            }))
                .then((responseEntity) => { var _a; return (_a = responseEntity) === null || _a === void 0 ? void 0 : _a.respond(); })
                .catch(error => {
                // TODO Inject error handler
                console.log(error);
                const mimeType = resolveMimeType(error.constructor, error);
                const responseEntity = constructResponseBasedOnMimeType(mimeType, responseEntityFactory);
                const producingMetadata = decorators_1.getProducingDecoratorMetadata(error.constructor);
                const statusCodeGenerator = producingMetadata.statusCode || (() => 500);
                responseEntity.status(statusCodeGenerator(error));
                responseEntity.setHeader('Content-Type', mimeType);
                responseEntity.body(error);
                responseEntity.respond();
            });
        };
    }
}
exports.RequestListenerFactory = RequestListenerFactory;
function createCallerArguments(restMethod, request, responseEntityFactory, responseInjection) {
    const args = [];
    if (responseInjection !== undefined) {
        const selection = responseInjection.select(responseEntityFactory);
        args[responseInjection.index] = new (selection.apply(responseEntityFactory))();
    }
    const requestBodyIndex = decorators_1.getRequestParameterIndexFromMethodMetaData(restMethod);
    if (requestBodyIndex !== undefined)
        args[requestBodyIndex] = request.body;
    assignParametersToArguments(args, restMethod, request.routeParams, 'path:');
    assignParametersToArguments(args, restMethod, request.queryParams, 'query:');
    return args;
}
function assignParametersToArguments(args, method, on, type) {
    Object.entries(on)
        .map(entry => ({ key: entry[0], value: entry[1] }))
        .map(entry => (Object.assign(Object.assign({}, entry), { index: decorators_1.getParameterIndexFromMetadata(method, type + entry.key), serializer: decorators_1.getParameterSerializer(method, type + entry.key) })))
        .filter(entry => entry.index !== undefined)
        .forEach(entry => args[entry.index] = entry.serializer(entry.value));
}
function constructResponseBasedOnMimeType(mimeType, factory) {
    if (mimeType === 'application/json')
        return new (factory.JsonResponseEntity())();
    if (mimeType.startsWith('text/'))
        return new (factory.TextResponseEntity())();
    return new (factory.ResponseEntity())();
}
function resolveStatus(restMethod, httpMethod, resultContent) {
    const generator = decorators_1.getProducingDecoratorMetadata(restMethod).statusCode;
    if (generator !== undefined)
        return generator(resultContent);
    if (resultContent === null || resultContent === undefined)
        return 204;
    if (httpMethod === 'GET')
        return 200;
    if (httpMethod === 'POST' || httpMethod === 'PUT' || httpMethod === 'PATCH')
        return 201;
    return 204;
}
function resolveMimeType(restMethod, restMethodResult) {
    var _a;
    let mimeType = 'text/plain';
    mimeType = decorators_1.getProducingDecoratorMetadata(restMethod).mimeType || mimeType;
    if (((_a = restMethodResult) === null || _a === void 0 ? void 0 : _a.constructor) !== undefined) {
        mimeType = decorators_1.getDeserializerMetadata(restMethodResult.constructor).mimeType || mimeType;
    }
    return mimeType;
}
//# sourceMappingURL=request-listener-factory.js.map