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
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const component_1 = require("./injection/src/component");
const decorators_1 = require("./server/src/decorators/");
const state_1 = require("./server/src/state");
const external_1 = require("./injection/src/external");
const loader1 = new state_1.ReadyStateEmitter();
let T = class T {
    index() {
    }
};
__decorate([
    decorators_1.Get('/app'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], T.prototype, "index", null);
T = __decorate([
    component_1.Component,
    server_1.Application({ port: 80, isReadyWhen: [loader1] })
], T);
let Z = class Z {
    constructor() {
        this.loader = new state_1.ReadyStateEmitter();
    }
};
__decorate([
    state_1.ReadyState,
    __metadata("design:type", state_1.ReadyStateEmitter)
], Z.prototype, "loader", void 0);
Z = __decorate([
    component_1.Component
], Z);
external_1.applicationContext.whenLoaded(() => {
    external_1.applicationContext.loadDependency(Z).then(z => {
        console.log('component loader executed');
        z.loader.changeStateToReady();
    });
});
setTimeout(() => {
    console.log('loader1 executed');
    loader1.changeStateToReady();
});
//# sourceMappingURL=play.js.map