import { OutgoingHttpHeaders, ServerResponse } from 'http';
import { HttpHeaders, HttpHeaderSet } from './http-headers';
import { Instantiable, Maybe } from '../../../global-types';
import { DeserializerFunction, getDeserializerMetadata } from '../decorators';

interface FinishedResponse {}

export interface Response {
    body( data: any ): Response;
    respond( data?: Maybe<Buffer | string> ): FinishedResponse;
    setHeader( header: string, value: string | Array<string> ): Response;
    setHeaders( headers: HttpHeaders | HttpHeaderSet ): Response;
    status( statusCode: number, statusMessage?: Maybe<string> ): Response;
    writeChunk( chunk: Buffer | string ): Response;
    writeHead(): Response;
}

export interface JsonResponse<T> extends Response {
    body( from?: Maybe<T> ): JsonResponse<T>;
}

export interface TextResponse extends Response {
    body( from: string ): TextResponse;
}

export interface ResponseFactory {
    ResponseEntity(): Instantiable<Response>;
    JsonResponseEntity<T>(): Instantiable<JsonResponse<T>>;
    TextResponseEntity(): Instantiable<TextResponse>;
}

export class ResponseEntityFactory implements ResponseFactory {

    constructor( private readonly response: ServerResponse ) {}

    public ResponseEntity(): Instantiable<Response> {
        const response: ServerResponse = this.response;
        return class implements Response {
            private readonly headers: OutgoingHttpHeaders = {};

            public body( data: any ): Response {
                return this;
            }

            public respond( data?: Maybe<Buffer | string> ): FinishedResponse {
                if ( data !== undefined && response.writable ) {
                    response.write(data);
                    response.end();
                }
                return {};
            }

            public setHeader( header: string, value: string | Array<string> ): Response {
                if ( response.headersSent ) return this;
                response.setHeader(header, value);
                this.headers[header] = value;
                return this;
            }

            public setHeaders( headers: HttpHeaders | HttpHeaderSet ): Response {
                if ( response.headersSent ) return this;
                if ( headers instanceof Set ) {
                    headers.forEach( header => this.setHeader(header[0], header[1]));
                } else {
                    Object.entries(headers).forEach(headerEntry => this.setHeader(headerEntry[0], headerEntry[1]));
                }
                return this;
            }

            public status( statusCode: number, statusMessage?: Maybe<string> ): Response {
                if ( response.headersSent ) return this;

                response.statusCode = statusCode;
                if ( statusMessage !== undefined ) response.statusMessage = statusMessage;
                return this;
            }

            public writeChunk( chunkData: Buffer | string ): Response {
                if ( !response.writable ) return this;
                response.write(chunkData);
                return this;
            }

            public writeHead(): Response {
                if ( response.headersSent ) return this;
                response.writeHead(response.statusCode, response.statusMessage,  this.headers);
                return this;
            }
        }
    }

    public JsonResponseEntity<T>(): Instantiable<JsonResponse<T>> {
        return class extends (this.ResponseEntity()) implements JsonResponse<T> {
            private _body: Maybe<T> = undefined;

            public body( from?: Maybe<T> ): JsonResponse<T> {
                this._body = from;
                return this;
            }

            public respond(): FinishedResponse {
                return super.respond(this.deserializeBody());
            }

            public setHeader( header: string, value: string | Array<string> ): JsonResponse<T> {
                super.setHeader(header, value);
                return this;
            }

            public setHeaders( headers: HttpHeaders | HttpHeaderSet ): JsonResponse<T> {
                super.setHeaders(headers);
                return this;
            }

            public status( statusCode: number, statusMessage?: Maybe<string> ): JsonResponse<T> {
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

            private deserializeBody(): string | Buffer {
                const defaultDeserializer: DeserializerFunction<any> = JSON.stringify;

                if ( this._body !== null && this._body !== undefined ) {
                    const deserializer: Maybe<DeserializerFunction<T>> =
                        getDeserializerMetadata((this._body as any).constructor).deserializer || defaultDeserializer;
                    return deserializer(this._body);
                }
                return defaultDeserializer(this._body);
            }
        }
    }

    public TextResponseEntity(): Instantiable<TextResponse> {
        return class extends (this.ResponseEntity()) implements TextResponse {
            private _body: Maybe<string> = undefined;

            public body( from: Maybe<any>, encoding: string = 'utf8' ): TextResponse {
                const deserialize: Maybe<string> | Buffer = this.deserialize(from);
                if ( deserialize instanceof Buffer ) {
                    this._body = deserialize.toString(encoding);
                    return this;
                }
                this._body = deserialize;
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

            public status( statusCode: number, statusMessage?: Maybe<string> ): TextResponse {
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

            private deserialize( something: Maybe<any | null> ): Maybe<string | Buffer> {
                if ( something === null || something === undefined ) return undefined;

                const deserializer: Maybe<DeserializerFunction<any>> =
                    getDeserializerMetadata((something as any).constructor).deserializer || String;
                return deserializer(something);
            }
        }
    }
}
