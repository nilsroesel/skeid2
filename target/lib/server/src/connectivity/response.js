"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../decorators");
class ResponseEntityFactory {
    constructor(response) {
        this.response = response;
    }
    ResponseEntity() {
        const response = this.response;
        return class {
            constructor() {
                this.headers = {};
            }
            body(data) {
                return this;
            }
            respond(data) {
                if (data !== undefined && response.writable) {
                    response.write(data);
                    response.end();
                }
                return {};
            }
            setHeader(header, value) {
                if (response.headersSent)
                    return this;
                response.setHeader(header, value);
                this.headers[header] = value;
                return this;
            }
            setHeaders(headers) {
                if (response.headersSent)
                    return this;
                if (headers instanceof Set) {
                    headers.forEach(header => this.setHeader(header[0], header[1]));
                }
                else {
                    Object.entries(headers).forEach(headerEntry => this.setHeader(headerEntry[0], headerEntry[1]));
                }
                return this;
            }
            status(statusCode, statusMessage) {
                if (response.headersSent)
                    return this;
                response.statusCode = statusCode;
                if (statusMessage !== undefined)
                    response.statusMessage = statusMessage;
                return this;
            }
            writeChunk(chunkData) {
                if (!response.writable)
                    return this;
                response.write(chunkData);
                return this;
            }
            writeHead() {
                if (response.headersSent)
                    return this;
                response.writeHead(response.statusCode, response.statusMessage, this.headers);
                return this;
            }
        };
    }
    JsonResponseEntity() {
        return class extends (this.ResponseEntity()) {
            constructor() {
                super(...arguments);
                this._body = undefined;
            }
            body(from) {
                this._body = from;
                return this;
            }
            respond() {
                return super.respond(this.deserializeBody());
            }
            setHeader(header, value) {
                super.setHeader(header, value);
                return this;
            }
            setHeaders(headers) {
                super.setHeaders(headers);
                return this;
            }
            status(statusCode, statusMessage) {
                super.status(statusCode, statusMessage);
                return this;
            }
            writeChunk(chunk) {
                return this;
            }
            writeHead() {
                super.writeHead();
                return this;
            }
            deserializeBody() {
                const defaultDeserializer = JSON.stringify;
                if (this._body !== null && this._body !== undefined) {
                    const deserializer = decorators_1.getDeserializerMetadata(this._body.constructor).deserializer || defaultDeserializer;
                    return deserializer(this._body);
                }
                return defaultDeserializer(this._body);
            }
        };
    }
    TextResponseEntity() {
        return class extends (this.ResponseEntity()) {
            constructor() {
                super(...arguments);
                this._body = undefined;
            }
            body(from, encoding = 'utf8') {
                const deserialize = this.deserialize(from);
                if (deserialize instanceof Buffer) {
                    this._body = deserialize.toString(encoding);
                    return this;
                }
                this._body = deserialize;
                return this;
            }
            respond(data) {
                return super.respond(this._body);
            }
            setHeader(header, value) {
                super.setHeader(header, value);
                return this;
            }
            setHeaders(headers) {
                super.setHeaders(headers);
                return this;
            }
            status(statusCode, statusMessage) {
                super.status(statusCode, statusMessage);
                return this;
            }
            writeChunk(chunk) {
                return this;
            }
            writeHead() {
                super.writeHead();
                return this;
            }
            deserialize(something) {
                if (something === null || something === undefined)
                    return undefined;
                const deserializer = decorators_1.getDeserializerMetadata(something.constructor).deserializer || String;
                return deserializer(something);
            }
        };
    }
}
exports.ResponseEntityFactory = ResponseEntityFactory;
//# sourceMappingURL=response.js.map