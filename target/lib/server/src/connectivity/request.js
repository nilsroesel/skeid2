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
const schema_1 = require("../schema");
const error_1 = require("../error");
const bad_query_parameter_error_1 = require("../error/bad-query-parameter-error");
class Request {
    constructor(headers, routeParams, queryParams, body) {
        this.headers = headers;
        this.routeParams = routeParams;
        this.queryParams = queryParams;
        this.body = body;
    }
    static serializeBody(request, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawBody = yield Request.binaryBody(request);
            const jsonBody = yield Promise.resolve()
                .then(() => schema.preProcessor()(rawBody.toString()))
                .catch(() => {
                throw new error_1.BadContentTypeError(rawBody.toString(), 'JSON');
            });
            return schema.serialize(jsonBody);
        });
    }
    static binaryBody(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let body = [];
                request.on('error', (error) => {
                    reject(error);
                }).on('data', (chunk) => {
                    body.push(chunk);
                }).on('end', () => {
                    resolve(Buffer.concat(body));
                }).on('close', () => {
                    resolve(Buffer.concat(body));
                });
            });
        });
    }
    static new(request, routeParameters, queryParameters, schema, querySchema) {
        return __awaiter(this, void 0, void 0, function* () {
            const serializedQueryParams = yield Promise.resolve()
                .then(() => { var _a; return ((_a = querySchema) === null || _a === void 0 ? void 0 : _a.serialize(queryParameters || {})) || queryParameters; })
                .catch(error => {
                if (error instanceof schema_1.InvalidSchemaError) {
                    throw new bad_query_parameter_error_1.BadQueryParameterError(error.message);
                }
                throw error;
            });
            if (schema === undefined) {
                return new Request(request.headers, routeParameters, serializedQueryParams, undefined);
            }
            const serializedBody = yield Request.serializeBody(request, schema)
                .catch(error => {
                if (error instanceof schema_1.InvalidSchemaError) {
                    throw new error_1.BadRequestError(`Expected Body Schema: ${JSON.stringify(error.message)}`);
                }
                throw error;
            });
            return new Request(request.headers, routeParameters, serializedQueryParams, serializedBody);
        });
    }
}
exports.Request = Request;
//# sourceMappingURL=request.js.map