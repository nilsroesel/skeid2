/// <reference types="node" />
import { ServerResponse } from 'http';
import { HttpHeaders, HttpHeaderSet } from './http-headers';
import { Instantiable, Maybe } from '../../../global-types';
interface FinishedResponse {
}
export interface Response {
    body(data: any): Response;
    respond(data?: Maybe<Buffer | string>): FinishedResponse;
    setHeader(header: string, value: string | Array<string>): Response;
    setHeaders(headers: HttpHeaders | HttpHeaderSet): Response;
    status(statusCode: number, statusMessage?: Maybe<string>): Response;
    writeChunk(chunk: Buffer | string): Response;
    writeHead(): Response;
}
export interface JsonResponse<T> extends Response {
    body(from?: Maybe<T>): JsonResponse<T>;
}
export interface TextResponse extends Response {
    body(from: string): TextResponse;
}
export interface ResponseFactory {
    ResponseEntity(): Instantiable<Response>;
    JsonResponseEntity<T>(): Instantiable<JsonResponse<T>>;
    TextResponseEntity(): Instantiable<TextResponse>;
}
export declare class ResponseEntityFactory implements ResponseFactory {
    private readonly response;
    constructor(response: ServerResponse);
    ResponseEntity(): Instantiable<Response>;
    JsonResponseEntity<T>(): Instantiable<JsonResponse<T>>;
    TextResponseEntity(): Instantiable<TextResponse>;
}
export {};
