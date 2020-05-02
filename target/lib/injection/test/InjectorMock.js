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
const component_1 = require("../src/component");
const autowire_1 = require("../src/autowire");
const after_load_1 = require("../src/after-load");
let Foo = class Foo {
    getMock() {
        return 'works';
    }
    afterLoad() {
        exports.afterLoadSet = true;
    }
};
__decorate([
    after_load_1.AfterLoad,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Foo.prototype, "afterLoad", null);
Foo = __decorate([
    component_1.Component
], Foo);
exports.Foo = Foo;
exports.afterLoadSet = false;
let Qualified = class Qualified extends Foo {
};
Qualified = __decorate([
    component_1.Component('manual')
], Qualified);
exports.Qualified = Qualified;
let Bar = class Bar {
};
__decorate([
    autowire_1.Autowired,
    __metadata("design:type", Foo)
], Bar.prototype, "foo", void 0);
__decorate([
    autowire_1.Autowired(Foo),
    __metadata("design:type", Object)
], Bar.prototype, "foo2", void 0);
__decorate([
    autowire_1.Autowired('manual'),
    __metadata("design:type", Qualified)
], Bar.prototype, "qualified", void 0);
Bar = __decorate([
    component_1.Component
], Bar);
exports.Bar = Bar;
//# sourceMappingURL=InjectorMock.js.map