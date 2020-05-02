"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../lib/injection/src/component");
const decorators_1 = require("../lib/server/src/decorators");
const schema_1 = require("../lib/server/src/schema");
const error_1 = require("../lib/server/src/error");
const EchoSchema = new schema_1.RestSchema({ echo: String });
schema_1.RestSchema.any();
let NotImplementedError = class NotImplementedError extends error_1.ApiError {
    constructor(message) {
        super(501, message);
    }
};
NotImplementedError = __decorate([
    decorators_1.Produces(501),
    decorators_1.Deserialize(JSON.stringify, 'text/plain'),
    __metadata("design:paramtypes", [String])
], NotImplementedError);
// Third Party error decorating
decorators_1.Deserialize(err => err.stack || err.toString())(Error);
decorators_1.Produces(500, 'text/plain')(Error);
decorators_1.Deserialize(JSON.stringify, 'application/json')(error_1.ApiError);
decorators_1.Produces(err => err.code)(error_1.ApiError);
let Version = class Version {
    constructor(versionNumber) {
        this.versionNumber = versionNumber;
    }
};
Version = __decorate([
    decorators_1.Deserialize(v => JSON.stringify({ version: v.versionNumber }), 'application/json'),
    __metadata("design:paramtypes", [String])
], Version);
let HtmlVersion = class HtmlVersion extends Version {
    constructor() {
        super(...arguments);
        this.template = `<html lang="EN"><body><h2>Version: ${this.versionNumber}</h2></body></html>`;
    }
};
HtmlVersion = __decorate([
    decorators_1.Deserialize(v => v.template, 'text/html')
], HtmlVersion);
let Api = class Api {
    raiseError() {
        const random = Math.random();
        if (random >= 0.5)
            throw new error_1.ApiError(503, 'An expected unåexpected condition occurred');
        throw new NotImplementedError('This endpoint is not implemented.');
    }
    staticServe() {
        const random = Math.random();
        if (random >= 0.5)
            return new HtmlVersion('api-v0:html');
        return new Version('api-v0:json');
    }
    echoStrictJsonBody(echoBody) {
        return echoBody;
    }
    echoStringBody(echoBody) {
        return echoBody;
    }
    echoSomething(echoBody, response) {
        response.status(200, 'Echo Ok');
        response.setHeader('Content-Type', 'text/plain');
        response.body(echoBody);
        response.respond();
    }
};
__decorate([
    decorators_1.Get('/error'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Api.prototype, "raiseError", null);
__decorate([
    decorators_1.Get('/static'),
    decorators_1.Produces(v => v instanceof HtmlVersion ? 201 : 200),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], Api.prototype, "staticServe", null);
__decorate([
    decorators_1.Post('/echo'),
    decorators_1.Consumes('application/json'),
    decorators_1.Produces(200, 'application/json'),
    __param(0, decorators_1.RequestBody(EchoSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Api.prototype, "echoStrictJsonBody", null);
__decorate([
    decorators_1.Post('/echo'),
    decorators_1.Consumes('text/plain'),
    decorators_1.Produces(200, 'text/plain'),
    __param(0, decorators_1.RequestBody(schema_1.RestSchema.string())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Api.prototype, "echoStringBody", null);
__decorate([
    decorators_1.Post('/echo'),
    __param(0, decorators_1.RequestBody(schema_1.RestSchema.string())),
    __param(1, decorators_1.ResponseEntity(f => f.TextResponseEntity)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Api.prototype, "echoSomething", null);
Api = __decorate([
    component_1.Component,
    decorators_1.Application({ port: 80 })
], Api);
//# sourceMappingURL=test-app.js.map