import { OutgoingHttpHeaders, ServerResponse } from 'http';
import { HttpHeaders, HttpHeaderSet } from './http-headers';
import { Instantiable } from '../../../global-types';

interface FinishedResponse {}

export interface Response {
    body( data: any ): Response;
    respond( data?: Buffer | string | undefined ): FinishedResponse;
    setHeader( header: string, value: string | Array<string> ): Response;
    setHeaders( headers: HttpHeaders | HttpHeaderSet ): Response;
    status( statusCode: number, statusMessage?: string | undefined ): Response;
    writeChunk( chunk: Buffer | string ): Response;
    writeHead(): Response;
}

export interface JsonResponse<T> extends Response {
    body( from: T ): JsonResponse<T>;
}

export interface TextResponse extends Response {
    body( from: string ): TextResponse;
}

export class ResponseEntityFactory {

    constructor( private readonly response: ServerResponse ) {}

    public ResponseEntity(): Instantiable<Response> {
        const response: ServerResponse = this.response;
        return class implements Response {
            private readonly headers: OutgoingHttpHeaders = {};

            public body( data: any ): Response {
                return this;
            }

            public respond( data?: Buffer | string | undefined ): FinishedResponse {
                if ( data !== undefined ) response.write(data);
                response.end();
                return {};
            }

            public setHeader( header: string, value: string | Array<string> ): Response {
                response.setHeader(header, value);
                this.headers[header] = value;
                return this;
            }

            public setHeaders( headers: HttpHeaders | HttpHeaderSet ): Response {
                if ( headers instanceof Set ) {
                    headers.forEach( header => this.setHeader(header[0], header[1]));
                } else {
                    Object.entries(headers).forEach(headerEntry => this.setHeader(headerEntry[0], headerEntry[1]));
                }
                return this;
            }

            public status( statusCode: number, statusMessage?: string | undefined ): Response {
                response.statusCode = statusCode;
                if ( statusMessage !== undefined ) response.statusMessage = statusMessage;
                return this;
            }

            public writeChunk( chunkData: Buffer | string ): Response {
                response.write(chunkData);
                return this;
            }

            public writeHead(): Response {
                response.writeHead(response.statusCode, response.statusMessage,  this.headers);
                return this;
            }
        }
    }

    public JsonResponseEntity<T>(): Instantiable<JsonResponse<T>> {
        return class extends (this.ResponseEntity()) implements JsonResponse<T> {
            private _body: T | undefined = undefined;

            public body( from: T | undefined ): JsonResponse<T> {
                this._body = from;
                return this;
            }

            public respond( data?: Buffer | string ): FinishedResponse {
                return super.respond(JSON.stringify(this._body));
            }

            public setHeader( header: string, value: string | Array<string> ): JsonResponse<T> {
                super.setHeader(header, value);
                return this;
            }

            public setHeaders( headers: HttpHeaders | HttpHeaderSet ): JsonResponse<T> {
                super.setHeaders(headers);
                return this;
            }

            public status( statusCode: number, statusMessage?: string | undefined ): JsonResponse<T> {
                super.status(statusCode, statusMessage);
                return this;
            }
            public writeChunk( chunk: Buffer | string ): JsonResponse<T> {
                return this;
            }

            public writeHead(): JsonResponse<T> {
                super.writeHead();
                return this;
            }
        }
    }

    public TextResponseEntity(): Instantiable<TextResponse> {
        return class extends (this.ResponseEntity()) implements TextResponse {
            private _body: string | undefined = undefined;

            public body( from: string | undefined ): TextResponse {
                this._body = from;
                return this;
            }

            public respond( data?: Buffer | string ): FinishedResponse {
                return super.respond(this._body);
            }

            public setHeader( header: string, value: string | Array<string> ): TextResponse{
                super.setHeader(header, value);
                return this;
            }

            public setHeaders( headers: HttpHeaders | HttpHeaderSet ): TextResponse {
                super.setHeaders(headers);
                return this;
            }

            public status( statusCode: number, statusMessage?: string | undefined ): TextResponse {
                super.status(statusCode, statusMessage);
                return this;
            }
            public writeChunk( chunk: Buffer | string ): TextResponse {
                return this;
            }

            public writeHead(): TextResponse {
                super.writeHead();
                return this;
            }
        }
    }
}
