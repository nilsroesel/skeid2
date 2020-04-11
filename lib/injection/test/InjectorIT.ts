import 'jasmine';
import { applicationContext } from '../src/external';
import { afterLoadSet, Bar } from './InjectorMock';

describe('Test Dependency Injection', () => {

    beforeAll(() => applicationContext.load());

    it('Autowired fields should be an instance', () => {
        applicationContext.loadDependency(Bar).then((bar) => {
            expect(bar.foo).toBeDefined('Autowired Field is unset');
            expect(bar.foo2).toBeDefined('Class Qualified Autowired Field is unset');
            expect(bar.qualified).toBeDefined('String Qualified Autowired field is unset');
            expect(bar.foo.getMock()).toBe('works');
            expect(bar.foo2.getMock()).toBe('works');
            expect(bar.qualified.getMock()).toBe('works');
        });
    });

    it('Should test after load', () => {
        expect(afterLoadSet).toBe(true);
    });

    it('Should test whenLoaded', () => {
       const spyObject = { callback: () => undefined };
       spyOn(spyObject, 'callback');

       applicationContext.whenLoaded(spyObject.callback);

       expect(spyObject.callback).toHaveBeenCalled();
    });
    
});
