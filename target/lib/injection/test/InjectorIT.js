"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
const external_1 = require("../src/external");
const InjectorMock_1 = require("./InjectorMock");
describe('Test Dependency Injection', () => {
    beforeAll(() => external_1.applicationContext.load());
    it('Autowired fields should be an instance', () => {
        external_1.applicationContext.loadDependency(InjectorMock_1.Bar).then((bar) => {
            expect(bar.foo).toBeDefined('Autowired Field is unset');
            expect(bar.foo2).toBeDefined('Class Qualified Autowired Field is unset');
            expect(bar.qualified).toBeDefined('String Qualified Autowired field is unset');
            expect(bar.foo.getMock()).toBe('works');
            expect(bar.foo2.getMock()).toBe('works');
            expect(bar.qualified.getMock()).toBe('works');
        });
    });
    it('Should test after load', () => {
        expect(InjectorMock_1.afterLoadSet).toBe(true);
    });
    it('Should test whenLoaded', () => {
        const spyObject = { callback: () => undefined };
        spyOn(spyObject, 'callback');
        external_1.applicationContext.whenLoaded(spyObject.callback);
        expect(spyObject.callback).toHaveBeenCalled();
    });
});
//# sourceMappingURL=InjectorIT.js.map